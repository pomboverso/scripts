# Aliases

alias tm='cd ~/projects/teamup_all'

alias tms='clear && tm'
alias tmb='clear && tm'

alias tmu='clear && tm && teamup-up-force'
alias tmd='clear && tm && teamup-down'

alias ptf='cd ~/projects/app_web_static_miguelrivas/matryoshka'
alias mr='cd ~/projects/app_web_static_miguelrivas/'
alias dev='cd ~/projects/'
alias ys='yarn serve'

alias android='~/apps/android-studio/bin/studio'
alias drawer="apps"

alias rst='exec bash -l'

ENDFORMAT="\e[0m"

# Styles
RESET=0
BOLD=1
FAINT=2
ITALIC=3

# Colors
BLACK=30
RED=31
GREEN=32
YELLOW=33
BLUE=34
MAGENTA=35
CYAN=36
LIGHTGRAY=37
GRAY=90
LIGHTRED=91
LIGHTGREEN=92
LIGHTYELLOW=93
LIGHTBLUE=94
LIGHTMAGENTA=95
LIGHTCYAN=96
WHITE=97

mr_format() {
  local result=$1
  local style=$2
  local color=$3
  local new_format="\\\e[${style}\;${color}m"

  eval "$result=${new_format}"
}

mr_set_time_value() {
  local result=$1
  local file=$2
  local index=$3
  local length=$4
  local string_size=${#file}

  if [ "$string_size" -gt "$index" ]
  then
    eval "$result=${file:index:length}"
  else
    eval "$result=00"
  fi
}

mr_print_manual() {
  local name=$1
  local description=$2
  local attrs=$3
  mr_format heading $BOLD $LIGHTYELLOW
  mr_format params $ITALIC $LIGHTBLUE

  echo -e "fn() ⇒ ${heading}$name $params$attrs${ENDFORMAT}"
  echo "$description"
  echo ""
}

mr_set_photos_name_from_date_taken() {
  local type=$1
  exiftool "-DateTimeOriginal>FileName" -d "I_%Y%m%d_%H%M%S.$type" -w %f.%e *.* --ext sh
}

mr_videos_stripmetadata() {
  mkdir -p ./output;
  for i in *; do ffmpeg -i "$i" -map_metadata -1 -c:v copy -c:a copy "./output/$i"; done
}

mr_videos_convert() {
  mkdir -p ./audio;
  for i in *; do ffmpeg -i "$i" -vn -map_metadata -1 "./audio/${i%.*}.mp3"; done
}

mr_set_photos_date_taken_from_name() {
  local format=$1
  local type=$2

  for file in "."/*."$type"
  do
    # 19991231235959 - Dec 31 1999 - 23:59:59
    if [ "$format" = "Ymd" ]
    then
      year=${file:2:4}
      month=${file:6:2}
      day=${file:8:2}
    # 991231235959 - Dec 31 1999 - 23:59:59
    elif [ "$format" = "ymd" ]
    then
      year=${file:2:2}
      month=${file:5:2}
      day=${file:8:2}
    # 123199235959 - Dec 31 1999 - 23:59:59
    elif [ "$format" = "mdy" ] 
    then
      month=${file:2:2}
      day=${file:5:2}
      year=${file:8:2}
    # 311299235959 - Dec 31 1999 - 23:59:59
    elif [ "$format" = "dmy" ] 
    then
      day=${file:2:2}
      month=${file:5:2}
      year=${file:8:2}
    fi
  done

  if [[ $format == *"Y"* ]]; then
    mr_set_time_value hours file 8 2
    mr_set_time_value minutes file 10 2
    mr_set_time_value seconds file 12 2
  else
    mr_set_time_value hours file 6 2
    mr_set_time_value minutes file 8 2
    mr_set_time_value seconds file 10 2
  fi

  if [[ ${seconds#0} -gt 59 ]]
  then
    seconds=$(( seconds - 59 ))
    if [[ $seconds -lt 10 ]]
    then
      seconds="0$seconds"
    fi
  fi

  echo "$year $month $day - $hours $minutes $seconds"
  exiftool "-AllDates=$year:$month:$day $hours:$minutes:$seconds" "$file"
  echo "Renaming pictures"
  exiftool "-DateTimeOriginal>FileName" -d 'I_%Y%m%d_%H%M%S.jpg' -w %f.%e *.* --ext sh
}

mr_secuence_to_video() {
  local type=$1
  ffmpeg -framerate 30 -i %04d."$type" -c:v libx264 -profile:v high -crf 20 -pix_fmt yuv420p secuence.mp4
}

mr_pdf_to() {
  local format=$1
  convert -density 300 *.pdf -quality 90 "pdf$format-coverted.$format"
}

mr_clear_permissions() {
  sudo chmod a+rw -R ./
}

mr_clean_system_files() {
  files=(".DS_Store" ".AppleDouble" ".LSOverride" ".DocumentRevisions-V100" ".fseventsd" ".Spotlight-V100" ".TemporaryItems" ".Trashes" ".VolumeIcon.icns" ".com.apple.timemachine.donotpresent" ".AppleDB" ".AppleDesktop" "Thumbs.db" "ehthumbs.db" "ehthumbs_vista.db" "desktop.ini")

  for f in ${files[@]}; do
    rm -r -f -v **/${f}
  done
}

mr_help() {
  local dummy="eĥoŝanĝo ĉiuĵaŭde"
  local br="☻ ------------------------------ "

  clear

  echo -e "
${br}Styles
0 → RESET → \e[0m${dummy}${ENDFORMAT}
1 → BOLD → \e[1m${dummy}${ENDFORMAT}
2 → FAINT → \e[2m${dummy}${ENDFORMAT}
3 → ITALIC → \e[3m${dummy}${ENDFORMAT}

${br}Colors
30 → BLACK → \e[30m${dummy}${ENDFORMAT}
31 → RED → \e[31m${dummy}${ENDFORMAT}
32 → GREEN → \e[32m${dummy}${ENDFORMAT}
33 → YELLOW → \e[33m${dummy}${ENDFORMAT}
34 → BLUE → \e[34m${dummy}${ENDFORMAT}
35 → MAGENTA → \e[35m${dummy}${ENDFORMAT}
36 → CYAN → \e[36m${dummy}${ENDFORMAT}
37 → LIGHTGRAY → \e[37m${dummy}${ENDFORMAT}
90 → GRAY → \e[90m${dummy}${ENDFORMAT}
91 → LIGHTRED → \e[91m${dummy}${ENDFORMAT}
92 → LIGHTGREEN → \e[92m${dummy}${ENDFORMAT}
93 → LIGHTYELLOW → \e[93m${dummy}${ENDFORMAT}
94 → LIGHTBLUE → \e[94m${dummy}${ENDFORMAT}
95 → LIGHTMAGENTA → \e[95m${dummy}${ENDFORMAT}
96 → LIGHTCYAN → \e[96m${dummy}${ENDFORMAT}
97 → WHITE → \e[97m${dummy}${ENDFORMAT}

${br}Formatting options
→ ENDFORMAT
"

  echo "${br}Functions"
  mr_print_manual "mr_format" "Create the beginning of the format with style and color (use ENDFORMAT to finish formatting)."
  mr_print_manual "mr_print_manual" "Create and format the help message."
  mr_print_manual "mr_set_photos_name_from_date_taken" "Change name of all the photos in the current directory from the day taken in the EXIF data." "(jpg | jpeg | png)"
  mr_print_manual "mr_set_photos_date_taken_from_name" "Change the date-taken data of all the photos in the current directory from the file name." "(Ymd | ymd | mdy | dmy) (jpg | jpeg | png)"
  mr_print_manual "mr_secuence_to_video" "Create a video clip from an image secuence" "(jpg | jpeg | png)"
  mr_print_manual "mr_pdf_to" "Create a JPG/PNG image secuence from a PDF file." "(jpg | png)"
  mr_print_manual "mr_clear_permissions" "Make all the file in the current directory and subdirectories accesible for all users."
  mr_print_manual "mr_clean_system_files" "Remove all the files that the Operating system leave behind: 

---- Windows:
→ Thumbs.db
→ desktop.in
→ ehthumbs.db
→ ehthumbs_vista.db

---- MacOS
→ .DS_Store
→ .AppleDouble
→ .LSOverride
→ .DocumentRevisions-V100
→ .fseventsd
→ .Spotlight-V100
→ .TemporaryItems
→ .Trashes
→ .VolumeIcon.icns
→ .com.apple.timemachine.donotpresent
→ .AppleDB
→ .AppleDesktop"
}