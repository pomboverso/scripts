#!/usr/bin/env ruby

COLUMNS = 16
CHARS = '0123456789ABCDEF'

# ANSI colors
COLORS = [
  "\e[30m", # Black
  "\e[30m", # Black
  "\e[30m", # Black
  "\e[92m", # Light Green
  "\e[32m", # Green
  "\e[33m", # Yellow
#   "\e[94m", # Light Blue
#   "\e[90m"  # Dark Gray
]

# Terminal dimensions
width  = `tput cols`.to_i
height = `tput lines`.to_i

# Column positions and vertical positions
x = Array.new(COLUMNS, 0)
y = Array.new(COLUMNS, 0)
color = Array.new(COLUMNS)

def get_free_x(current_column, x, width)
  loop do
    candidate = rand(1..width)

    unique = true

    x.each_with_index do |position, index|
      next if index == current_column

      if position == candidate
        unique = false
        break
      end
    end

    return candidate if unique
  end
end

def randomize_color
  COLORS.sample
end

def initialize_columns(x, y, color, width, height)
  COLUMNS.times do |c|
    x[c] = get_free_x(c, x, width)
    y[c] = rand(1..height)
    color[c] = randomize_color
  end
end

def reset_column(c, x, y, color, width)
  x[c] = get_free_x(c, x, width)
  y[c] = 1
  color[c] = randomize_color
end

def draw_column(c, x, y, color)
  # Move cursor to x,y
  print "\e[#{y[c]};#{x[c]}H"

  # Set column color
  print color[c]

  # Draw random character
  print CHARS[rand(CHARS.length)]

  y[c] += 1
end

# Clear screen
print "\e[2J"
print "\e[H"

# Hide cursor
print "\e[?25l"

begin
  initialize_columns(x, y, color, width, height)

  loop do
    COLUMNS.times do |c|
      draw_column(c, x, y, color)

      if y[c] > height
        reset_column(c, x, y, color, width)
      end
    end

    sleep 0.05

    # Check for keyboard input
    if IO.select([$stdin], nil, nil, 0)
      break
    end
  end

ensure
  # Reset terminal color
  print "\e[0m"

  # Show cursor
  print "\e[?25h"

  # Clear screen
  print "\e[2J"
  print "\e[H"
end
