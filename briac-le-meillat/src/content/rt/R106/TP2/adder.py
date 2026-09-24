def adder (a,b,Cin) :
    S = a^b^Cin
    Cout = (a and b) or (Cin and (a^b))
    return (S, Cout)

# Test
assert adder(0,0,0) == (0, 0)
assert adder(0,1,0) == (1, 0)
assert adder(0,0,1) == (1, 0)
assert adder(0,1,1) == (0, 1)
assert adder(1,1,1) == (1, 1)
print('All good ✌️')