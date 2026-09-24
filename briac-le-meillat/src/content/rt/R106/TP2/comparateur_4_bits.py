

def comparateur_4_bits (a,b) :
    c=not (a[3]^b[3])
    d=not (a[2]^b[2])
    e=not (a[1]^b[1])

    s0=(a[3] and not b[3]) or c and (a[2] and not b[2]) or c and d and (a[1] and not b[1]) or c and d and e and (a[0] and not b[0])
    s1=(not a[3] and b[3]) or c and (not a[2] and b[2]) or c and d and (not a[1] and b[1]) or c and d and e and (not a[0] and b[0])

    return int(s1), int(s0)

# Test
a = [1, 0, 1, 0]  # 5 en binaire (0101)
b = [0, 1, 1, 0]  # 6 en binaire (0110)
s1, s0 = comparateur_4_bits(b, a)
print(f"Sortie: {s1}{s0}")

if s1 == s0 :
    print(f"égalité (a=b)")
elif s1 < s0 :
    print(f"a > b")
elif s1 > s0 :
    print(f"a <b ")