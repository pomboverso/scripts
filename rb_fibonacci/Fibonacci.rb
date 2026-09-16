a,b,c,d,e=0,1,0,0,0

#print "introduce el numero de repeticiones: "
#e=gets.chomp
e=12

until (d==e)
c=a+b
b=a
a=c
d=d+1
print a+"\n"
end

#gets