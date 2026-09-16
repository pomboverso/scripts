#!/usr/bin/python3
import os
import tkinter as tk
from tkinter import messagebox
import webbrowser

class Color:
  def __init__(self, name, hex):
    self.name = name
    self.hex = hex

dir_path = os.path.dirname(os.path.realpath(__file__))
current_color = 15
grid_size = 16
buttons = [[0 for x in range(grid_size)] for y in range(grid_size)]
colors = [
  Color("Black", "#000000"),
  Color("Blue", "#01007f"),
  Color("Green", "#008008"),
  Color("Cyan", "#008083"),
  Color("Red", "#7e0003"),
  Color("Magenta", "#7d037c"),
  Color("Brown", "#7f8100"),
  Color("Light Grey", "#c0c0c2"),
  Color("Dark Grey", "#808080"),
  Color("Light Blue", "#0001fc"),
  Color("Light Green", "#01fe05"),
  Color("Light Cyan", "#00fffd"),
  Color("Light Red", "#fb0200"),
  Color("Light Magenta", "#fb01ff"),
  Color("Yellow", "#fffe01"),
  Color("White", "#fefff1"),
]

def set_window_title(color):
  win.title("Bitmap Creator - " + colors[color].name + "(" + str(color) + ")")

def close_window():
  win.destroy()

def clear_values():
  global current_color
  current_color = 15
  set_window_title(current_color)
  for x in range(grid_size):
    for y in range(grid_size):
      buttons[x][y].config(
        text=str(0),
        bg=colors[0].hex
      )

def save_cpp_file():
  bitmap = "{\n"
  for x in range(grid_size):
    bitmap += "  "
    for y in range(grid_size):
      val = int(buttons[x][y].cget("text"))
      text = str(val)
      if(val < 10):
        text = "0" + str(val)
      bitmap += text + ", "
    bitmap = bitmap[:-1] + "\n"
  bitmap += "}"

  f = open("bitmap.cpp", "w")
  f.write(bitmap)
  f.close()
  messagebox.showinfo("Bitmap Created", "file created at: " + dir_path + "/bitmap.cpp")

def save_pascal_file():
  bitmap = ""
  for x in range(grid_size):
    bitmap += "["
    for y in range(grid_size):
      val = int(buttons[x][y].cget("text"))
      text = str(val)
      if(val < 10):
        text = "0" + str(val)
      bitmap += text + ", "
    bitmap = bitmap[:-2]
    bitmap += "],\n"

  f = open("bitmap.pas", "w")
  f.write(bitmap)
  f.close()
  messagebox.showinfo("Bitmap Created", "file created at: " + dir_path + "/bitmap.pas")

def change_color_btn(x,y):
  buttons[x][y].config(
    text=str(current_color),
    bg=colors[current_color].hex
  )

def change_color(color):
  global current_color
  set_window_title(color)
  current_color = int(color)

def about_me():
  top_window = tk.Toplevel()
  top_window.title("About Bitmap Creator")
  top_window.config(padx=20, pady=10)
  tk.Label(
    top_window,
    text="Bitmap Creator v1.0.0",
    font=("Arial", 12)
  ).pack()
  label1 = tk.Label(
    top_window,
    text="miguel-rivas.github.io",
    fg="blue",
    cursor="hand2"
  )
  label1.pack()
  label1.bind(
    "<Button-1>",
    lambda e: webbrowser.open_new("https://miguel-rivas.github.io/")
  )
  tk.Label(
    top_window,
    text="© 2021 - Miguel Rivas",
    font=("Arial", 9)
  ).pack()
  # tk.Button(top_window, text="Close", command=top_window.destroy).pack()

# defining window
win = tk.Tk()
set_window_title(current_color)
win.resizable(False, False)

# creating menu bar
menu1 = tk.Menu()
win.config(menu=menu1)

# creating options for the menu bar
file_menu = tk.Menu(menu1, tearoff=0)
save_menu = tk.Menu(menu1, tearoff=0)
edit_menu = tk.Menu(menu1, tearoff=0)
colors_menu = tk.Menu(menu1, tearoff=0)
help_menu = tk.Menu(menu1, tearoff=0)

# adding options to the menu bar
menu1.add_cascade(label="File", menu=file_menu)
menu1.add_cascade(label="Options", menu=edit_menu)
menu1.add_cascade(label="Help", menu=help_menu)

file_menu.add_command(label="New File", command=clear_values)
file_menu.add_cascade(label="Save As", menu=save_menu)
file_menu.add_separator()
file_menu.add_command(label="Exit", command=close_window)

edit_menu.add_cascade(label="Set Color", menu=colors_menu)

help_menu.add_command(label="About...", command=about_me)

save_menu.add_command(label="C++", command=save_cpp_file)
save_menu.add_command(label="Pascal", command=save_pascal_file)

for index in range(len(colors)):
  colors_menu.add_command(label=colors[index].name, command=lambda index=index: change_color(index))

for x in range(grid_size):
  for y in range(grid_size):
    buttons[x][y] = tk.Button(
      win,
      text=str(0),
      width=2,
      height=2,
      bg=colors[0].hex,
      command=lambda x=x, y=y: change_color_btn(x,y)
    )
    buttons[x][y].grid(column=x, row=y)

color_btn = [0 for x in range(grid_size)]
for index in range(grid_size):
  color_btn[index] = tk.Button(
    win,
    text=index,
    width=2,
    height=2,
    bg=colors[index].hex,
    command=lambda index=index: change_color(index)
  )
  color_btn[index].grid(column=index, row=grid_size)

win.mainloop()