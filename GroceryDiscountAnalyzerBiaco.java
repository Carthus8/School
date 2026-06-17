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

    public static double finalPriceDisc(double amount, int percentage)
    {
        return amount * (percentage * 0.01);
    }

    public static void main (String[] args)
    {
        Scanner user_input = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = user_input.nextLine();

        System.out.print("Enter your age: ");
        int age = user_input.nextInt();

        System.out.print("Enter Purchase Amount: ");
        double amount = user_input.nextDouble();

        user_input.nextLine(); //removes leftover newline

        System.out.print("Enter Membership code (REG, VIP): ");
        String membership = user_input.nextLine();

        System.out.println("===============================");
        System.out.println("Customer Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Age Category: " + AgeCategory(age));
        System.out.println("Purchase Amount: " + amount);
        int percentage = discountRate(amount);
        System.out.println("Discount Rate: " + percentage + "%");
        System.out.println("Final Price: " + (amount - finalPriceDisc(amount, percentage)));

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