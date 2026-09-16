# nim c matrix.nim && ./matrix

import os
import terminal
import random
import strformat

const
  Columns = 16
  Chars = "0123456789ABCDEF"

var
  width = terminalWidth()
  height = terminalHeight()

  x: array[Columns, int]
  y: array[Columns, int]
  color: array[Columns, string]

const Colors = [
  "\e[30m", # Black
  "\e[30m", # Black
  "\e[30m", # Black
  "\e[92m", # Light Green
  "\e[32m", # Green
  "\e[33m"  # Yellow
]

proc getFreeX(currentColumn: int): int =
  while true:
    let candidate = rand(1..width)
    var unique = true

    for i in 0..<Columns:
      if i != currentColumn and x[i] == candidate:
        unique = false
        break

    if unique:
      return candidate

proc randomizeColor(): string =
  Colors[rand(0..<Colors.len)]

proc initializeColumns() =
  for c in 0..<Columns:
    x[c] = getFreeX(c)
    y[c] = rand(1..height)
    color[c] = randomizeColor()

proc resetColumn(c: int) =
  x[c] = getFreeX(c)
  y[c] = 1
  color[c] = randomizeColor()

proc drawColumn(c: int) =
  stdout.write(
    "\x1b[" &
    $y[c] &
    ";" &
    $x[c] &
    "H"
  )

  stdout.write(color[c])
  stdout.write(Chars[rand(0..<Chars.len)])

  y[c] += 1

randomize()

# Clear screen
stdout.write("\e[2J")
stdout.write("\e[H")

# Hide cursor
stdout.write("\e[?25l")

initializeColumns()

while true:
  for c in 0..<Columns:
    drawColumn(c)

    if y[c] > height:
      resetColumn(c)

  stdout.flushFile()
  sleep(50)

# Cleanup
stdout.write("\e[0m")
stdout.write("\e[?25h")
stdout.write("\e[2J")
stdout.write("\e[H")
