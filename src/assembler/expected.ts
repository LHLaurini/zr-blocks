function asBuffer(str: string): Buffer {
    return Buffer.from(str.replace(/\s/g, ''), 'hex')
}

export const EXPECTED_BYTES = asBuffer('\
    08 00 08 0f 08 ff 0b ff  00 00 01 10 02 20 03 30 \
    04 00 05 10 06 20 07 30  10 00 10 0f 10 ff 13 ff \
    14 00 14 0f 14 ff 17 ff  18 00 18 0f 18 ff 1b ff \
    1c 00 1c 0f 1c ff 1f ff  28 00 28 0f 28 ff 2b ff \
    20 00 21 10 22 20 23 30  24 00 25 10 26 20 27 30 \
    30 80 30 81 30 83 30 82  30 7f 31 7f 32 7f 33 7f \
    40 00 40 01 40 10 40 12  43 12 43 34 43 56 43 78 \
    41 00 41 01 41 10 41 12  44 00 44 01 44 10 44 12 \
    45 00 45 01 45 10 45 12  42 12 42 34 42 56 42 78 \
    47 12 47 34 47 56 47 78  48 12 48 34 48 56 48 78 \
    49 12 49 34 49 56 49 78  46 12 46 34 46 56 46 78 \
    4c 12 4c 34 4c 56 4c 78  4d 12 4d 34 4d 56 4d 78 \
    4e 00 4e 01 4e 10 4e 12  4f 00 4f 01 4f 10 4f 12 \
    50 00 50 01 50 10 50 12  53 12 53 34 53 56 53 78 \
    51 00 51 01 51 10 51 12  54 00 54 01 54 10 54 12 \
    55 00 55 01 55 10 55 12  52 12 52 34 52 56 52 78 \
    57 12 57 34 57 56 57 78  58 12 58 34 58 56 58 78 \
    59 12 59 34 59 56 59 78  56 12 56 34 56 56 56 78 \
    5c 12 5c 34 5c 56 5c 78  5d 12 5d 34 5d 56 5d 78 \
    5e 00 5e 01 5e 10 5e 12  5f 00 5f 01 5f 10 5f 12 \
    60 00 60 01 60 10 60 12  63 12 63 34 63 56 63 78 \
    61 00 61 01 61 10 61 12  64 00 64 01 64 10 64 12 \
    65 00 65 01 65 10 65 12  62 12 62 34 62 56 62 78 \
    67 12 67 34 67 56 67 78  68 12 68 34 68 56 68 78 \
    69 12 69 34 69 56 69 78  66 12 66 34 66 56 66 78 \
    6c 12 6c 34 6c 56 6c 78  6d 12 6d 34 6d 56 6d 78 \
    6e 00 6e 01 6e 10 6e 12  6f 00 6f 01 6f 10 6f 12 \
    70 00 70 01 70 10 70 12  73 12 73 34 73 56 73 78 \
    71 00 71 01 71 10 71 12  74 00 74 01 74 10 74 12 \
    75 00 75 01 75 10 75 12  72 12 72 34 72 56 72 78 \
    77 12 77 34 77 56 77 78  78 12 78 34 78 56 78 78 \
    79 12 79 34 79 56 79 78  76 12 76 34 76 56 76 78 \
    7c 12 7c 34 7c 56 7c 78  7d 12 7d 34 7d 56 7d 78 \
    7e 00 7e 01 7e 10 7e 12  7f 00 7f 01 7f 10 7f 12 \
    80 00 80 01 80 10 80 12  83 12 83 34 83 56 83 78 \
    81 00 81 01 81 10 81 12  84 00 84 01 84 10 84 12 \
    85 00 85 01 85 10 85 12  82 12 82 34 82 56 82 78 \
    87 12 87 34 87 56 87 78  88 12 88 34 88 56 88 78 \
    89 12 89 34 89 56 89 78  86 12 86 34 86 56 86 78 \
    8c 12 8c 34 8c 56 8c 78  8d 12 8d 34 8d 56 8d 78 \
    8e 00 8e 01 8e 10 8e 12  8f 00 8f 01 8f 10 8f 12 \
    90 00 90 01 90 10 90 12  93 12 93 34 93 56 93 78 \
    91 00 91 01 91 10 91 12  94 00 94 01 94 10 94 12 \
    95 00 95 01 95 10 95 12  92 12 92 34 92 56 92 78 \
    97 12 97 34 97 56 97 78  98 12 98 34 98 56 98 78 \
    99 12 99 34 99 56 99 78  96 12 96 34 96 56 96 78 \
    9c 12 9c 34 9c 56 9c 78  9d 12 9d 34 9d 56 9d 78 \
    9e 00 9e 01 9e 10 9e 12  9f 00 9f 01 9f 10 9f 12 \
    a0 00 a0 01 a0 10 a0 12  a1 00 a1 01 a1 10 a1 12 \
    a4 00 a4 01 a4 10 a4 12  a5 00 a5 01 a5 10 a5 12 \
    a2 12 a2 34 a2 56 a2 78  a8 12 a8 34 a8 56 a8 78 \
    a9 12 a9 34 a9 56 a9 78  a6 12 a6 34 a6 56 a6 78 \
    ac 12 ac 34 ac 56 ac 78  ad 12 ad 34 ad 56 ad 78 \
    ae 00 ae 01 ae 10 ae 12  af 00 af 01 af 10 af 12 \
    b0 00 b0 01 b0 10 b0 12  b1 00 b1 01 b1 10 b1 12 \
    b4 00 b4 01 b4 10 b4 12  b5 00 b5 01 b5 10 b5 12 \
    b2 12 b2 34 b2 56 b2 78  b8 12 b8 34 b8 56 b8 78 \
    b9 12 b9 34 b9 56 b9 78  b6 12 b6 34 b6 56 b6 78 \
    bc 12 bc 34 bc 56 bc 78  bd 12 bd 34 bd 56 bd 78 \
    be 00 be 01 be 10 be 12  bf 00 bf 01 bf 10 bf 12 \
    c0 00 c0 01 c0 10 c0 12  c1 00 c1 01 c1 10 c1 12 \
    c4 00 c4 01 c4 10 c4 12  c5 00 c5 01 c5 10 c5 12 \
    c2 12 c2 34 c2 56 c2 78  c8 12 c8 34 c8 56 c8 78 \
    c9 12 c9 34 c9 56 c9 78  c6 12 c6 34 c6 56 c6 78 \
    cc 12 cc 34 cc 56 cc 78  cd 12 cd 34 cd 56 cd 78 \
    ce 00 ce 01 ce 10 ce 12  cf 00 cf 01 cf 10 cf 12 \
    d0 00 d0 01 d0 10 d0 12  d3 12 d3 34 d3 56 d3 78 \
    d1 00 d1 01 d1 10 d1 12  d4 00 d4 01 d4 10 d4 12 \
    d5 00 d5 01 d5 10 d5 12  d2 12 d2 34 d2 56 d2 78 \
    d7 12 d7 34 d7 56 d7 78  d8 12 d8 34 d8 56 d8 78 \
    d9 12 d9 34 d9 56 d9 78  d6 12 d6 34 d6 56 d6 78 \
    dc 12 dc 34 dc 56 dc 78  dd 12 dd 34 dd 56 dd 78 \
    de 00 de 01 de 10 de 12  df 00 df 01 df 10 df 12 \
    e0 00 e0 0f e0 ff e3 ff  e4 00 e4 0f e4 ff e7 ff \
    e8 00 e8 0f e8 ff eb ff  ec 00 ec 0f ec ff ef ff \
    f0 00 f0 10 f0 20 f0 30  f4 00 f4 10 f4 20 f4 30 \
    f8 12 f8 34 f8 56 f8 78  fc 12 fc 34 fc 56 fc 78 \
    fe 00 fe 10 fe 20 fe 30  f1 00 f1 10 f1 20 f1 30 \
    f5 00 f5 10 f5 20 f5 30  f9 12 f9 34 f9 56 f9 78 \
    fd 12 fd 34 fd 56 fd 78  ff 00 ff 10 ff 20 ff 30 \
    ')

export const EXPECTED_MNE = "\
jmp 0x000\n\
jmp 0x00f\n\
jmp 0x0ff\n\
jmp 0x3ff\n\
jmp p0 r0\n\
jmp p1 r1\n\
jmp p2 r2\n\
jmp p3 r3\n\
jmp p0 [r0]\n\
jmp p1 [r1]\n\
jmp p2 [r2]\n\
jmp p3 [r3]\n\
jz 0x000\n\
jz 0x00f\n\
jz 0x0ff\n\
jz 0x3ff\n\
jnz 0x000\n\
jnz 0x00f\n\
jnz 0x0ff\n\
jnz 0x3ff\n\
jc 0x000\n\
jc 0x00f\n\
jc 0x0ff\n\
jc 0x3ff\n\
jvp 0x000\n\
jvp 0x00f\n\
jvp 0x0ff\n\
jvp 0x3ff\n\
call 0x000\n\
call 0x00f\n\
call 0x0ff\n\
call 0x3ff\n\
call p0 r0\n\
call p1 r1\n\
call p2 r2\n\
call p3 r3\n\
call p0 [r0]\n\
call p1 [r1]\n\
call p2 [r2]\n\
call p3 [r3]\n\
ret\n\
retc\n\
rets\n\
retz\n\
mvs r0, 0x7f\n\
mvs r1, 0x7f\n\
mvs r2, 0x7f\n\
mvs r3, 0x7f\n\
and r0, r0\n\
and r0, r1\n\
and r1, r0\n\
and r1, r2\n\
and r0, 0x12\n\
and r0, 0x34\n\
and r0, 0x56\n\
and r0, 0x78\n\
and r0, [r0]\n\
and r0, [r1]\n\
and r1, [r0]\n\
and r1, [r2]\n\
and [r0], r0\n\
and [r0], r1\n\
and [r1], r0\n\
and [r1], r2\n\
and [r0], [r0]\n\
and [r0], [r1]\n\
and [r1], [r0]\n\
and [r1], [r2]\n\
and r0, [0x12]\n\
and r0, [0x34]\n\
and r0, [0x56]\n\
and r0, [0x78]\n\
and [r0], 0x12\n\
and [r0], 0x34\n\
and [r0], 0x56\n\
and [r0], 0x78\n\
and [0x12], r0\n\
and [0x34], r0\n\
and [0x56], r0\n\
and [0x78], r0\n\
and [0x12], [r0]\n\
and [0x34], [r0]\n\
and [0x56], [r0]\n\
and [0x78], [r0]\n\
and [r0], [0x12]\n\
and [r0], [0x34]\n\
and [r0], [0x56]\n\
and [r0], [0x78]\n\
and io [0x12], r0\n\
and io [0x34], r0\n\
and io [0x56], r0\n\
and io [0x78], r0\n\
and io r0, [0x12]\n\
and io r0, [0x34]\n\
and io r0, [0x56]\n\
and io r0, [0x78]\n\
and io [r0], r0\n\
and io [r0], r1\n\
and io [r1], r0\n\
and io [r1], r2\n\
and io r0, [r0]\n\
and io r0, [r1]\n\
and io r1, [r0]\n\
and io r1, [r2]\n\
or r0, r0\n\
or r0, r1\n\
or r1, r0\n\
or r1, r2\n\
or r0, 0x12\n\
or r0, 0x34\n\
or r0, 0x56\n\
or r0, 0x78\n\
or r0, [r0]\n\
or r0, [r1]\n\
or r1, [r0]\n\
or r1, [r2]\n\
or [r0], r0\n\
or [r0], r1\n\
or [r1], r0\n\
or [r1], r2\n\
or [r0], [r0]\n\
or [r0], [r1]\n\
or [r1], [r0]\n\
or [r1], [r2]\n\
or r0, [0x12]\n\
or r0, [0x34]\n\
or r0, [0x56]\n\
or r0, [0x78]\n\
or [r0], 0x12\n\
or [r0], 0x34\n\
or [r0], 0x56\n\
or [r0], 0x78\n\
or [0x12], r0\n\
or [0x34], r0\n\
or [0x56], r0\n\
or [0x78], r0\n\
or [0x12], [r0]\n\
or [0x34], [r0]\n\
or [0x56], [r0]\n\
or [0x78], [r0]\n\
or [r0], [0x12]\n\
or [r0], [0x34]\n\
or [r0], [0x56]\n\
or [r0], [0x78]\n\
or io [0x12], r0\n\
or io [0x34], r0\n\
or io [0x56], r0\n\
or io [0x78], r0\n\
or io r0, [0x12]\n\
or io r0, [0x34]\n\
or io r0, [0x56]\n\
or io r0, [0x78]\n\
or io [r0], r0\n\
or io [r0], r1\n\
or io [r1], r0\n\
or io [r1], r2\n\
or io r0, [r0]\n\
or io r0, [r1]\n\
or io r1, [r0]\n\
or io r1, [r2]\n\
xor r0, r0\n\
xor r0, r1\n\
xor r1, r0\n\
xor r1, r2\n\
xor r0, 0x12\n\
xor r0, 0x34\n\
xor r0, 0x56\n\
xor r0, 0x78\n\
xor r0, [r0]\n\
xor r0, [r1]\n\
xor r1, [r0]\n\
xor r1, [r2]\n\
xor [r0], r0\n\
xor [r0], r1\n\
xor [r1], r0\n\
xor [r1], r2\n\
xor [r0], [r0]\n\
xor [r0], [r1]\n\
xor [r1], [r0]\n\
xor [r1], [r2]\n\
xor r0, [0x12]\n\
xor r0, [0x34]\n\
xor r0, [0x56]\n\
xor r0, [0x78]\n\
xor [r0], 0x12\n\
xor [r0], 0x34\n\
xor [r0], 0x56\n\
xor [r0], 0x78\n\
xor [0x12], r0\n\
xor [0x34], r0\n\
xor [0x56], r0\n\
xor [0x78], r0\n\
xor [0x12], [r0]\n\
xor [0x34], [r0]\n\
xor [0x56], [r0]\n\
xor [0x78], [r0]\n\
xor [r0], [0x12]\n\
xor [r0], [0x34]\n\
xor [r0], [0x56]\n\
xor [r0], [0x78]\n\
xor io [0x12], r0\n\
xor io [0x34], r0\n\
xor io [0x56], r0\n\
xor io [0x78], r0\n\
xor io r0, [0x12]\n\
xor io r0, [0x34]\n\
xor io r0, [0x56]\n\
xor io r0, [0x78]\n\
xor io [r0], r0\n\
xor io [r0], r1\n\
xor io [r1], r0\n\
xor io [r1], r2\n\
xor io r0, [r0]\n\
xor io r0, [r1]\n\
xor io r1, [r0]\n\
xor io r1, [r2]\n\
cmp r0, r0\n\
cmp r0, r1\n\
cmp r1, r0\n\
cmp r1, r2\n\
cmp r0, 0x12\n\
cmp r0, 0x34\n\
cmp r0, 0x56\n\
cmp r0, 0x78\n\
cmp r0, [r0]\n\
cmp r0, [r1]\n\
cmp r1, [r0]\n\
cmp r1, [r2]\n\
cmp [r0], r0\n\
cmp [r0], r1\n\
cmp [r1], r0\n\
cmp [r1], r2\n\
cmp [r0], [r0]\n\
cmp [r0], [r1]\n\
cmp [r1], [r0]\n\
cmp [r1], [r2]\n\
cmp r0, [0x12]\n\
cmp r0, [0x34]\n\
cmp r0, [0x56]\n\
cmp r0, [0x78]\n\
cmp [r0], 0x12\n\
cmp [r0], 0x34\n\
cmp [r0], 0x56\n\
cmp [r0], 0x78\n\
cmp [0x12], r0\n\
cmp [0x34], r0\n\
cmp [0x56], r0\n\
cmp [0x78], r0\n\
cmp [0x12], [r0]\n\
cmp [0x34], [r0]\n\
cmp [0x56], [r0]\n\
cmp [0x78], [r0]\n\
cmp [r0], [0x12]\n\
cmp [r0], [0x34]\n\
cmp [r0], [0x56]\n\
cmp [r0], [0x78]\n\
cmp io [0x12], r0\n\
cmp io [0x34], r0\n\
cmp io [0x56], r0\n\
cmp io [0x78], r0\n\
cmp io r0, [0x12]\n\
cmp io r0, [0x34]\n\
cmp io r0, [0x56]\n\
cmp io r0, [0x78]\n\
cmp io [r0], r0\n\
cmp io [r0], r1\n\
cmp io [r1], r0\n\
cmp io [r1], r2\n\
cmp io r0, [r0]\n\
cmp io r0, [r1]\n\
cmp io r1, [r0]\n\
cmp io r1, [r2]\n\
add r0, r0\n\
add r0, r1\n\
add r1, r0\n\
add r1, r2\n\
add r0, 0x12\n\
add r0, 0x34\n\
add r0, 0x56\n\
add r0, 0x78\n\
add r0, [r0]\n\
add r0, [r1]\n\
add r1, [r0]\n\
add r1, [r2]\n\
add [r0], r0\n\
add [r0], r1\n\
add [r1], r0\n\
add [r1], r2\n\
add [r0], [r0]\n\
add [r0], [r1]\n\
add [r1], [r0]\n\
add [r1], [r2]\n\
add r0, [0x12]\n\
add r0, [0x34]\n\
add r0, [0x56]\n\
add r0, [0x78]\n\
add [r0], 0x12\n\
add [r0], 0x34\n\
add [r0], 0x56\n\
add [r0], 0x78\n\
add [0x12], r0\n\
add [0x34], r0\n\
add [0x56], r0\n\
add [0x78], r0\n\
add [0x12], [r0]\n\
add [0x34], [r0]\n\
add [0x56], [r0]\n\
add [0x78], [r0]\n\
add [r0], [0x12]\n\
add [r0], [0x34]\n\
add [r0], [0x56]\n\
add [r0], [0x78]\n\
add io [0x12], r0\n\
add io [0x34], r0\n\
add io [0x56], r0\n\
add io [0x78], r0\n\
add io r0, [0x12]\n\
add io r0, [0x34]\n\
add io r0, [0x56]\n\
add io r0, [0x78]\n\
add io [r0], r0\n\
add io [r0], r1\n\
add io [r1], r0\n\
add io [r1], r2\n\
add io r0, [r0]\n\
add io r0, [r1]\n\
add io r1, [r0]\n\
add io r1, [r2]\n\
sub r0, r0\n\
sub r0, r1\n\
sub r1, r0\n\
sub r1, r2\n\
sub r0, 0x12\n\
sub r0, 0x34\n\
sub r0, 0x56\n\
sub r0, 0x78\n\
sub r0, [r0]\n\
sub r0, [r1]\n\
sub r1, [r0]\n\
sub r1, [r2]\n\
sub [r0], r0\n\
sub [r0], r1\n\
sub [r1], r0\n\
sub [r1], r2\n\
sub [r0], [r0]\n\
sub [r0], [r1]\n\
sub [r1], [r0]\n\
sub [r1], [r2]\n\
sub r0, [0x12]\n\
sub r0, [0x34]\n\
sub r0, [0x56]\n\
sub r0, [0x78]\n\
sub [r0], 0x12\n\
sub [r0], 0x34\n\
sub [r0], 0x56\n\
sub [r0], 0x78\n\
sub [0x12], r0\n\
sub [0x34], r0\n\
sub [0x56], r0\n\
sub [0x78], r0\n\
sub [0x12], [r0]\n\
sub [0x34], [r0]\n\
sub [0x56], [r0]\n\
sub [0x78], [r0]\n\
sub [r0], [0x12]\n\
sub [r0], [0x34]\n\
sub [r0], [0x56]\n\
sub [r0], [0x78]\n\
sub io [0x12], r0\n\
sub io [0x34], r0\n\
sub io [0x56], r0\n\
sub io [0x78], r0\n\
sub io r0, [0x12]\n\
sub io r0, [0x34]\n\
sub io r0, [0x56]\n\
sub io r0, [0x78]\n\
sub io [r0], r0\n\
sub io [r0], r1\n\
sub io [r1], r0\n\
sub io [r1], r2\n\
sub io r0, [r0]\n\
sub io r0, [r1]\n\
sub io r1, [r0]\n\
sub io r1, [r2]\n\
rot r0, r0\n\
rot r0, r1\n\
rot r1, r0\n\
rot r1, r2\n\
rot r0, [r0]\n\
rot r0, [r1]\n\
rot r1, [r0]\n\
rot r1, [r2]\n\
rot [r0], r0\n\
rot [r0], r1\n\
rot [r1], r0\n\
rot [r1], r2\n\
rot [r0], [r0]\n\
rot [r0], [r1]\n\
rot [r1], [r0]\n\
rot [r1], [r2]\n\
rot r0, [0x12]\n\
rot r0, [0x34]\n\
rot r0, [0x56]\n\
rot r0, [0x78]\n\
rot [0x12], r0\n\
rot [0x34], r0\n\
rot [0x56], r0\n\
rot [0x78], r0\n\
rot [0x12], [r0]\n\
rot [0x34], [r0]\n\
rot [0x56], [r0]\n\
rot [0x78], [r0]\n\
rot [r0], [0x12]\n\
rot [r0], [0x34]\n\
rot [r0], [0x56]\n\
rot [r0], [0x78]\n\
rot io [0x12], r0\n\
rot io [0x34], r0\n\
rot io [0x56], r0\n\
rot io [0x78], r0\n\
rot io r0, [0x12]\n\
rot io r0, [0x34]\n\
rot io r0, [0x56]\n\
rot io r0, [0x78]\n\
rot io [r0], r0\n\
rot io [r0], r1\n\
rot io [r1], r0\n\
rot io [r1], r2\n\
rot io r0, [r0]\n\
rot io r0, [r1]\n\
rot io r1, [r0]\n\
rot io r1, [r2]\n\
shl r0, r0\n\
shl r0, r1\n\
shl r1, r0\n\
shl r1, r2\n\
shl r0, [r0]\n\
shl r0, [r1]\n\
shl r1, [r0]\n\
shl r1, [r2]\n\
shl [r0], r0\n\
shl [r0], r1\n\
shl [r1], r0\n\
shl [r1], r2\n\
shl [r0], [r0]\n\
shl [r0], [r1]\n\
shl [r1], [r0]\n\
shl [r1], [r2]\n\
shl r0, [0x12]\n\
shl r0, [0x34]\n\
shl r0, [0x56]\n\
shl r0, [0x78]\n\
shl [0x12], r0\n\
shl [0x34], r0\n\
shl [0x56], r0\n\
shl [0x78], r0\n\
shl [0x12], [r0]\n\
shl [0x34], [r0]\n\
shl [0x56], [r0]\n\
shl [0x78], [r0]\n\
shl [r0], [0x12]\n\
shl [r0], [0x34]\n\
shl [r0], [0x56]\n\
shl [r0], [0x78]\n\
shl io [0x12], r0\n\
shl io [0x34], r0\n\
shl io [0x56], r0\n\
shl io [0x78], r0\n\
shl io r0, [0x12]\n\
shl io r0, [0x34]\n\
shl io r0, [0x56]\n\
shl io r0, [0x78]\n\
shl io [r0], r0\n\
shl io [r0], r1\n\
shl io [r1], r0\n\
shl io [r1], r2\n\
shl io r0, [r0]\n\
shl io r0, [r1]\n\
shl io r1, [r0]\n\
shl io r1, [r2]\n\
sha r0, r0\n\
sha r0, r1\n\
sha r1, r0\n\
sha r1, r2\n\
sha r0, [r0]\n\
sha r0, [r1]\n\
sha r1, [r0]\n\
sha r1, [r2]\n\
sha [r0], r0\n\
sha [r0], r1\n\
sha [r1], r0\n\
sha [r1], r2\n\
sha [r0], [r0]\n\
sha [r0], [r1]\n\
sha [r1], [r0]\n\
sha [r1], [r2]\n\
sha r0, [0x12]\n\
sha r0, [0x34]\n\
sha r0, [0x56]\n\
sha r0, [0x78]\n\
sha [0x12], r0\n\
sha [0x34], r0\n\
sha [0x56], r0\n\
sha [0x78], r0\n\
sha [0x12], [r0]\n\
sha [0x34], [r0]\n\
sha [0x56], [r0]\n\
sha [0x78], [r0]\n\
sha [r0], [0x12]\n\
sha [r0], [0x34]\n\
sha [r0], [0x56]\n\
sha [r0], [0x78]\n\
sha io [0x12], r0\n\
sha io [0x34], r0\n\
sha io [0x56], r0\n\
sha io [0x78], r0\n\
sha io r0, [0x12]\n\
sha io r0, [0x34]\n\
sha io r0, [0x56]\n\
sha io r0, [0x78]\n\
sha io [r0], r0\n\
sha io [r0], r1\n\
sha io [r1], r0\n\
sha io [r1], r2\n\
sha io r0, [r0]\n\
sha io r0, [r1]\n\
sha io r1, [r0]\n\
sha io r1, [r2]\n\
mov r0, r0\n\
mov r0, r1\n\
mov r1, r0\n\
mov r1, r2\n\
mov r0, 0x12\n\
mov r0, 0x34\n\
mov r0, 0x56\n\
mov r0, 0x78\n\
mov r0, [r0]\n\
mov r0, [r1]\n\
mov r1, [r0]\n\
mov r1, [r2]\n\
mov [r0], r0\n\
mov [r0], r1\n\
mov [r1], r0\n\
mov [r1], r2\n\
mov [r0], [r0]\n\
mov [r0], [r1]\n\
mov [r1], [r0]\n\
mov [r1], [r2]\n\
mov r0, [0x12]\n\
mov r0, [0x34]\n\
mov r0, [0x56]\n\
mov r0, [0x78]\n\
mov [r0], 0x12\n\
mov [r0], 0x34\n\
mov [r0], 0x56\n\
mov [r0], 0x78\n\
mov [0x12], r0\n\
mov [0x34], r0\n\
mov [0x56], r0\n\
mov [0x78], r0\n\
mov [0x12], [r0]\n\
mov [0x34], [r0]\n\
mov [0x56], [r0]\n\
mov [0x78], [r0]\n\
mov [r0], [0x12]\n\
mov [r0], [0x34]\n\
mov [r0], [0x56]\n\
mov [r0], [0x78]\n\
mov io [0x12], r0\n\
mov io [0x34], r0\n\
mov io [0x56], r0\n\
mov io [0x78], r0\n\
mov io r0, [0x12]\n\
mov io r0, [0x34]\n\
mov io r0, [0x56]\n\
mov io r0, [0x78]\n\
mov io [r0], r0\n\
mov io [r0], r1\n\
mov io [r1], r0\n\
mov io [r1], r2\n\
mov io r0, [r0]\n\
mov io r0, [r1]\n\
mov io r1, [r0]\n\
mov io r1, [r2]\n\
djnz r1, 0x000\n\
djnz r1, 0x00f\n\
djnz r1, 0x0ff\n\
djnz r1, 0x3ff\n\
djnz r2, 0x000\n\
djnz r2, 0x00f\n\
djnz r2, 0x0ff\n\
djnz r2, 0x3ff\n\
djnz r3, 0x000\n\
djnz r3, 0x00f\n\
djnz r3, 0x0ff\n\
djnz r3, 0x3ff\n\
djnz r4, 0x000\n\
djnz r4, 0x00f\n\
djnz r4, 0x0ff\n\
djnz r4, 0x3ff\n\
inc r0\n\
inc r1\n\
inc r2\n\
inc r3\n\
inc [r0]\n\
inc [r1]\n\
inc [r2]\n\
inc [r3]\n\
inc [0x12]\n\
inc [0x34]\n\
inc [0x56]\n\
inc [0x78]\n\
inc io [0x12]\n\
inc io [0x34]\n\
inc io [0x56]\n\
inc io [0x78]\n\
inc io [r0]\n\
inc io [r1]\n\
inc io [r2]\n\
inc io [r3]\n\
dec r0\n\
dec r1\n\
dec r2\n\
dec r3\n\
dec [r0]\n\
dec [r1]\n\
dec [r2]\n\
dec [r3]\n\
dec [0x12]\n\
dec [0x34]\n\
dec [0x56]\n\
dec [0x78]\n\
dec io [0x12]\n\
dec io [0x34]\n\
dec io [0x56]\n\
dec io [0x78]\n\
dec io [r0]\n\
dec io [r1]\n\
dec io [r2]\n\
dec io [r3]\n\
"

export const EXPECTED_BLOCKS = [
    asBuffer('08 00 08 00 08 03 08 03'),
    asBuffer('08 10 08 10 08 13 08 13'),
    asBuffer('09 00 09 00 09 03 09 03'),
    asBuffer('09 10 09 10 09 13 09 13'),
    asBuffer('0A 00 0A 00 0A 03 0A 03'),
    asBuffer('0A 10 0A 10 0A 13 0A 13'),
    asBuffer('0B 00 0B 00 0B 03 0B 03'),
    asBuffer('0B 10 0B 10 0B 13 0B 13'),
];

export const EXPECTED_RECURSIVE = [
    asBuffer('0A 00'),
    asBuffer('08 00'),
]

export const EXPECTED_LINKER = {
    start: asBuffer('28 02 08 01 D3 00 30 80'),
    interrupt: asBuffer('30 80'),
    key: asBuffer('FF FF'),
}

export const EXPECTED_LINKER_MNE = {
    start: 'call 0x002\njmp 0x001\nmov r0, 0x00\nret\n',
    interrupt: 'ret\n',
    key: '\n',
}
