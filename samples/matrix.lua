#!/usr/bin/env lua

local COLUMNS = 16
local CHARS = "0123456789ABCDEF"

-- ANSI colors
local COLORS = {
    "\27[30m", -- Black
    "\27[30m", -- Black
    "\27[30m", -- Black
    "\27[92m", -- Light Green
    "\27[32m", -- Green
    "\27[33m", -- Yellow
}

-- Terminal dimensions
local width = tonumber(io.popen("tput cols"):read("*a"))
local height = tonumber(io.popen("tput lines"):read("*a"))

-- Column positions and vertical positions
local x = {}
local y = {}
local color = {}

-- Find an unused X position
local function get_free_x(current_column)
    while true do
        local candidate = math.random(1, width)
        local unique = true

        for i = 1, COLUMNS do
            if i ~= current_column and x[i] == candidate then
                unique = false
                break
            end
        end

        if unique then
            return candidate
        end
    end
end

-- Pick a random color
local function randomize_color()
    return COLORS[math.random(#COLORS)]
end

-- Initialize columns
local function initialize_columns()
    for c = 1, COLUMNS do
        x[c] = get_free_x(c)
        y[c] = math.random(1, height)
        color[c] = randomize_color()
    end
end

-- Reset a column
local function reset_column(c)
    x[c] = get_free_x(c)
    y[c] = 1
    color[c] = randomize_color()
end

-- Draw a column
local function draw_column(c)
    -- Move cursor to x,y
    io.write(string.format("\27[%d;%dH", y[c], x[c]))

    -- Set color
    io.write(color[c])

    -- Random character
    local index = math.random(1, #CHARS)
    io.write(CHARS:sub(index, index))

    y[c] = y[c] + 1
end

-- Seed random number generator
math.randomseed(os.time())

-- Clear screen
io.write("\27[2J")
io.write("\27[H")

-- Hide cursor
io.write("\27[?25l")

initialize_columns()

while true do

    for c = 1, COLUMNS do
        draw_column(c)

        if y[c] > height then
            reset_column(c)
        end
    end

    -- ~50ms
    os.execute("sleep 0.05")
end

-- Reset terminal
io.write("\27[0m")
io.write("\27[?25h")
io.write("\27[2J")
io.write("\27[H")
