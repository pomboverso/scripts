.syntax unified
.arm

.global _start

.section .text

_start:
    bl print_hello

    mov r0, #0
    mov r7, #1
    svc #0

blue_background:
    mov r0, #1
    ldr r1, =bg_blue
    mov r2, #5
    mov r7, #4
    svc #0
    bx lr

yellow_text:
    mov r0, #1
    ldr r1, =fg_yellow
    mov r2, #5
    mov r7, #4
    svc #0
    bx lr

reset_color:
    mov r0, #1
    ldr r1, =reset
    mov r2, #4
    mov r7, #4
    svc #0
    bx lr

print_hello:
    push {lr}

    bl blue_background
    bl yellow_text

    mov r0, #1
    ldr r1, =message
    mov r2, #14
    mov r7, #4
    svc #0

    bl reset_color

    pop {lr}
    bx lr

.section .rodata

bg_blue:
    .ascii "\033[44m"

fg_yellow:
    .ascii "\033[33m"

reset:
    .ascii "\033[0m"

message:
    .ascii "Hello, 2\n"