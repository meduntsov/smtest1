#!/usr/bin/env bash
set -euo pipefail

# Небольшой пример без использования Python:
# выводит аргументы построчно с их индексом.
main() {
  if [ "$#" -eq 0 ]; then
    echo "Использование: ./solution.sh <аргумент1> [аргумент2 ...]"
    exit 0
  fi

  local i=1
  for arg in "$@"; do
    printf '%d: %s\n' "$i" "$arg"
    i=$((i + 1))
  done
}

main "$@"
