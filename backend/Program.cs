using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ErpDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")
        ?? "Host=localhost;Port=5432;Database=developer_erp;Username=postgres;Password=postgres"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ErpDbContext>();
    db.Database.EnsureCreated();
    SeedData.Initialize(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/api/project-360", async (ErpDbContext db) =>
{
    var ep = await db.ExecutionPackages.ToListAsync();
    var response = new Project360Dto(
        "ЖК Северный Парк",
        24,
        ep.Sum(x => x.PlannedCost),
        ep.Sum(x => x.ActualCost),
        ep.Count(x => x.Status == EpStatus.Risk),
        ep.Count(x => x.Status == EpStatus.Blocked),
        DateOnly.FromDateTime(DateTime.Today.AddDays(210)),
        new[]
        {
            "Фасад Корпус 1 имеет отставание 18 дней. Рекомендуется ускорить поставку витражей.",
            "Сдвиг транша №2 может увеличить процентную нагрузку на 4,2 млн руб.",
            "Тендер по лифтовому оборудованию не закрыт — риск блокировки отделки."
        });

    return Results.Ok(response);
});

app.MapGet("/api/execution-packages", async (ErpDbContext db) =>
    Results.Ok(await db.ExecutionPackages.OrderBy(x => x.Code).ToListAsync()));

app.MapGet("/api/reference-data", () => Results.Ok(ReferenceData.All()));

app.Run();

public class ErpDbContext(DbContextOptions<ErpDbContext> options) : DbContext(options)
{
    public DbSet<ExecutionPackage> ExecutionPackages => Set<ExecutionPackage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ExecutionPackage>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Code).HasMaxLength(32);
            e.Property(x => x.Name).HasMaxLength(256);
            e.Property(x => x.FundingSource).HasMaxLength(128);
            e.Property(x => x.CashFlowImpact).HasMaxLength(512);
        });
    }
}

public static class SeedData
{
    public static void Initialize(ErpDbContext db)
    {
        if (db.ExecutionPackages.Any()) return;

        var rnd = new Random(42);
        var statuses = new[] { EpStatus.Plan, EpStatus.InProgress, EpStatus.Risk, EpStatus.Blocked, EpStatus.Completed };
        var types = new[] { EpType.Production, EpType.Management, EpType.Financial };
        var corps = new[] { "Корпус 1", "Корпус 2", "Корпус 3" };

        var data = Enumerable.Range(1, 60).Select(i =>
        {
            var start = DateOnly.FromDateTime(DateTime.Today.AddDays(-rnd.Next(10, 80)));
            var finish = start.AddDays(rnd.Next(20, 140));
            var status = statuses[rnd.Next(statuses.Length)];
            var planned = rnd.Next(9_000_000, 80_000_000);
            var actual = status == EpStatus.Plan ? 0 : rnd.Next((int)(planned * 0.4), (int)(planned * 1.3));
            return new ExecutionPackage
            {
                Id = Guid.NewGuid(),
                Code = $"EP-{i:000}",
                Name = $"{corps[rnd.Next(corps.Length)]} / Пакет работ {i}",
                Type = types[rnd.Next(types.Length)],
                Status = status,
                PlannedStart = start,
                PlannedFinish = finish,
                ActualStart = status == EpStatus.Plan ? null : start.AddDays(rnd.Next(0, 6)),
                ActualFinish = status is EpStatus.Completed ? finish.AddDays(rnd.Next(-7, 20)) : null,
                PlannedCost = planned,
                ActualCost = actual,
                FundingSource = rnd.Next(2) == 0 ? "Банковская кредитная линия" : "Собственный капитал",
                InterestRate = rnd.Next(2) == 0 ? 0 : Math.Round(8 + rnd.NextDouble() * 5, 2),
                ParentEpCode = i > 1 ? $"EP-{Math.Max(1, i - rnd.Next(1, 4)):000}" : null,
                LinkedProductionEpCode = $"EP-{Math.Max(1, i - 1):000}",
                CashFlowImpact = "Влияние на транш и ежемесячный cash flow"
            };
        }).ToList();

        db.ExecutionPackages.AddRange(data);
        db.SaveChanges();
    }
}

public class ExecutionPackage
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public EpType Type { get; set; }
    public EpStatus Status { get; set; }
    public DateOnly PlannedStart { get; set; }
    public DateOnly PlannedFinish { get; set; }
    public DateOnly? ActualStart { get; set; }
    public DateOnly? ActualFinish { get; set; }
    public decimal PlannedCost { get; set; }
    public decimal ActualCost { get; set; }
    public string FundingSource { get; set; } = string.Empty;
    public double? InterestRate { get; set; }
    public string? ParentEpCode { get; set; }
    public string LinkedProductionEpCode { get; set; } = string.Empty;
    public string CashFlowImpact { get; set; } = string.Empty;
}

public enum EpType
{
    Production,
    Management,
    Financial
}

public enum EpStatus
{
    Plan,
    InProgress,
    Blocked,
    Risk,
    Completed
}

public record Project360Dto(
    string ProjectName,
    int ScheduleDeviationDays,
    decimal PlannedBudget,
    decimal ActualBudget,
    int EpInRisk,
    int EpBlocked,
    DateOnly ForecastFinish,
    IEnumerable<string> AiRecommendations);

public record ReferenceDataDto(
    string[] Disciplines,
    string[] Subsystems,
    string[] WorkTypes,
    string[] Units,
    string[] CostItems,
    string[] FundingSources,
    string[] EpTypes,
    string[] ChangeTypes,
    string[] RiskTypes);

public static class ReferenceData
{
    public static ReferenceDataDto All() => new(
        Disciplines: ["Архитектура", "Конструктив", "ОВиК", "ЭОМ", "Слаботочные системы"],
        Subsystems: ["Фасад", "Лифты", "Инженерные сети", "Отделка МОП", "Благоустройство"],
        WorkTypes: ["Проектирование", "Поставка", "Монтаж", "ПНР", "Сдача"],
        Units: ["м²", "м³", "шт", "компл", "пог.м"],
        CostItems: ["СМР", "Оборудование", "Проектные работы", "Проценты", "Комиссии"],
        FundingSources: ["Собственные средства", "Кредитная линия", "Эскроу"],
        EpTypes: ["Производственный", "Управленческий", "Финансовый"],
        ChangeTypes: ["Срок", "Бюджет", "Объём", "Техническое"],
        RiskTypes: ["Сроки", "Контрактация", "Финансы", "Интеграционные конфликты"]);
}
