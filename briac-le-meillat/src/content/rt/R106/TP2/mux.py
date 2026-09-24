def mux (s0, s1, d0, d1, d2, d3) :
    return int((d0 and not s1 and not s0) or (d1 and not s1 and s0) or (d2 and s1 and not s0) or (d3 and s1 and s0))

assert mux(0, 0, 1, 0, 0, 0) == 1
assert mux(1, 0, 0, 1, 0, 0) == 1
assert mux(0, 1, 0, 0, 1, 0) == 1
assert mux(1, 1, 0, 0, 0, 1) == 1
print('All good ✌️')