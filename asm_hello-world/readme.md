Assemble
```sh
arm-linux-gnueabihf-as -o hello_ARMv7.o hello_ARMv7.s
```

```sh
arm-linux-gnueabihf-ld -o hello_ARMv7 hello_ARMv7.o
```

Check file
```sh
file hello_ARMv7
```

Push to connected android device
```sh
adb push hello_ARMv7 /data/local/tmp/hello
```

Make it executable
```sh
adb shell chmod 755 /data/local/tmp/hello
```

Run it
```sh
adb shell /data/local/tmp/hello
```

All
```sh
arm-linux-gnueabihf-as -o hello_ARMv7.o hello_ARMv7.s && arm-linux-gnueabihf-ld -o hello_ARMv7 hello_ARMv7.o && adb push hello_ARMv7 /data/local/tmp/hello && adb shell chmod 755 /data/local/tmp/hello && adb shell /data/local/tmp/hello
```