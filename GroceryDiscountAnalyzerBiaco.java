import java.util.Scanner;

public class GroceryDiscountAnalyzerBiaco
{
    public static String AgeCategory(int age)
    {
        if (age > 0 && age <= 12)
        {
            return "Child";
        }
        else if (age > 12 && age <= 19)
        {
            return "Teenager";
        }
        else if (age > 19 && age <= 59)
        {
            return "Adult";
        }
        else if (age > 59)
        {
            return "Senior Citizen";
        }
        else 
        {
            return "Invalid Age";
        }
    }

    public static int discountRate(double amount)
    {
        if (amount > 0 && amount <= 500)
        {
            return 0;
        }
        else if (amount > 500 && amount <= 1000)
        {
            return 5;
        }
        else if (amount > 1000 && amount <= 5000)
        {
            return 10;
        }
        else
        {
            return 15;
        }
    }

    public static double finalPrice(double amount, int percentage)
    {
        return amount * (percentage * 0.01);
    }

    public static void main (String[] args)
    {
        Scanner user_input = new Scanner(System.in);

        System.out.println("Enter your name: ");
        String name = user_input.nextLine();

        System.out.println("Enter your age: ");
        int age = user_input.nextInt();

        System.out.println("Enter Purchase Amount: ");
        double amount = user_input.nextDouble();

        System.out.println("Enter Membeship code (REG, VIP): ");
        String membership = user_input.nextLine();

        System.out.println("\nCustomer Name: " + name);
        System.out.println("\nAge: " + age);
        System.out.println("\nAge Category: " + AgeCategory(age));
        System.out.println("\nPurchase Amount: " + amount);
        int percentage = discountRate(amount);
        System.out.println("\nDiscount Rate: " + percentage + "%");
        System.out.println("\nFinal Price: " + finalPrice(amount, percentage));

        switch (membership)
        {
            case "REG":
                System.out.println("Membership Code: REG");
                System.out.println("Membership Type: Regular Member");
                break;
            case "VIP":
                System.out.println("Membership Code: VIP");
                System.out.println("Membership Type: VIP Member");
                break;
            case "EMP":
                System.out.println("Membership Code: EMP");
                System.out.println("Membership Type: Employee Member");
                break;
            default:
                System.out.println("Invalid Classification");
                break;
        }
        user_input.close();
    }
}