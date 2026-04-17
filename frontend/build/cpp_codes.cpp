// cpp_codes.cpp

#include <iostream>
#include <vector>
#include <algorithm>
#include <cctype>

using namespace std;

// 1. Factorial
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

// 2. Sum of a vector
int sumVector(const vector<int>& v) {
    int sum = 0;
    for (int num : v) {
        sum += num;
    }
    return sum;
}

// 3. Fibonacci Sequence
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 4. Palindrome check
bool isPalindrome(string s) {
    string cleaned;
    for (char c : s) {
        if (isalnum(c)) {
            cleaned += tolower(c);
        }
    }
    string reversed = cleaned;
    reverse(reversed.begin(), reversed.end());
    return cleaned == reversed;
}

// 5. Prime number check
bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    // 1. Factorial
    cout << factorial(5) << endl;

    // 2. Sum of a vector
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << sumVector(numbers) << endl;

    // 3. Fibonacci Sequence
    cout << fibonacci(10) << endl;

    // 4. Palindrome check
    cout << isPalindrome("madam") << endl;
    cout << isPalindrome("race a car") << endl;

    // 5. Prime number check
    cout << isPrime(17) << endl;
    cout << isPrime(4) << endl;

    return 0;
}