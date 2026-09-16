sizes=(36 48 72 96 108 144 162 192 216 324 432)
files=("icon")
# "icon_alpha" "icon_background"

for f in ${files[@]}; do
  for s in ${sizes[@]}; do
    convert ${f}.svg -resize ${s}x${s} ${f}_${s}x${s}.png
  done
done