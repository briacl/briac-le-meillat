

def adder (a,b,Cin) :
    S = a^b^Cin
    Cout = (a and b) or (Cin and (a^b))
    return (S, Cout)

def adder_n_bits (num1, num2) :
    num1.reverse()
    num2.reverse()
    addition = []
    Cin = 0
    for i in range(len(num1)):
        S, Cin = adder(num1[i],num2[i],Cin)
        addition.append(S)
    addition.append(Cin)
    addition.reverse()
    return (addition)

s_1 = input("entrez votre premier nb base 2 :")
num1 = []
for i in s_1:
    num1.append(int(i))

s_2 = input("entrez votre second nb base 2 : ")
num2 = []
for i in s_1:
    num2.append(int(i))

solution = adder_n_bits(num1, num2)
print(solution)
