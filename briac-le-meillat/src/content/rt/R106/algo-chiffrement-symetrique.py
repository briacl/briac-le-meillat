

#!python3

# but : Coder le script Python permettant de retrouver les adresses de réseau et de broadcast en utilisant des opérateurs bit à bit

# Bienvenue dans le programme calcul_adresses_reseau_broadcast

def encode_decode_message (message, key):
    encoded_message = ""
    for i in message :
        i_code=ord(i)
        encoded_message += chr(i_code ^ key)
    return(encoded_message)

message = input("Quel est votre message ? : ")


key = 0b11011011

print(message)

encoded_message = encode_decode_message(message, key)
print(encoded_message)

decoded_message = encode_decode_message(encoded_message, key)
print(decoded_message)

assert message == decoded_message