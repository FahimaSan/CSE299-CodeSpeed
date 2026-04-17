# python_codes.py

# 1. Factorial
def factorial(n):
    return 1 if n == 0 else n * factorial(n - 1)

print(factorial(5))

# 2. Sum of a list
numbers = [1, 2, 3, 4, 5]
sum_of_numbers = sum(numbers)
print(sum_of_numbers)

# 3. Fibonacci Sequence
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))

# 4. Palindrome check
def is_palindrome(s):
    s = ''.join(char.lower() for char in s if char.isalnum())
    return s == s[::-1]

print(is_palindrome("madam"))
print(is_palindrome("race a car"))

# 5. Prime number check
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

print(is_prime(17))
print(is_prime(4))