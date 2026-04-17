// java_codes.java

public class java_codes {

    public static void main(String[] args) {
        // 1. Factorial
        System.out.println(factorial(5));

        // 2. Sum of an array
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println(sum);

        // 3. Fibonacci Sequence
        System.out.println(fibonacci(10));

        // 4. Palindrome check
        System.out.println(isPalindrome("madam"));
        System.out.println(isPalindrome("race a car"));

        // 5. Prime number check
        System.out.println(isPrime(17));
        System.out.println(isPrime(4));
    }

    public static int factorial(int n) {
        if (n == 0) return 1;
        return n * factorial(n - 1);
    }

    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static boolean isPalindrome(String s) {
        String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        return cleaned.equals(new StringBuilder(cleaned).reverse().toString());
    }

    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
}