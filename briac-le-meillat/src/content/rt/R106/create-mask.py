value = 255
bit_length = value.bit_length()
print("number of bits needed to code the number: ", bit_length)
mask = (1 << bit_length) - 1
print(bin(mask))