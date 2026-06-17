import java.util.Scanner;
import java.util.InputMismatchException;

public class StoreInventoryAnalyzerBiaco 
{
    public static String getStockStatus(int quantity)
    {
        if (quantity == 0)
        {
            return "Out of Stock";
        }
        else if (quantity > 0 && quantity <= 10)
        {
            return "Critical Low";
        }
        else if (quantity > 10 && quantity <= 30)
        {
            return "Low Stock";
        }
        else if (quantity > 30 && quantity <= 100)
        {
            return "Adequate";
        }
        else
        {
            return "Well Stocked";
        }
    }

    public static String getReorderAdvice(int quantity)
    {
        if (quantity == 0)
        {
            return "Order Immediately";
        }
        else if (quantity > 0 && quantity <= 10)
        {
            return "Order Urgently";
        }
        else if (quantity > 10 && quantity <= 30)
        {
            return "Reorder Soon";
        }
        else if (quantity > 30 && quantity <= 100)
        {
            return "Monitor Stock";
        }
        else
        {
            return "No Reorder Needed";
        }
    }

    public static String getCategoryName(String ccode)
    {
        switch (ccode)
        {
            case "ELEC":
                return "Electronics";
            case "GROC":
                return "Groceries";
            case "CLTH":
                return "Clothing";
            case "APPL":
                return "Applicances";
            default:
                return "Invalid Category Code";
        }
    }
    public static void main (String[] args)
    {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Product Name: ");
        String pname = sc.nextLine();

        int quantity = 0;
        double price = 0;
        while (true)
        {
            try
            {
                System.out.print("Enter Stock Quantity: ");
                quantity = sc.nextInt();
            }
            catch (InputMismatchException e)
            {
                System.out.print("Invalid input, try again");
                sc.nextLine();
            }

            sc.nextLine();
            try
            {
                System.out.print("Enter Unit Price: ");
                price = sc.nextDouble();
                break;
            }
            catch (InputMismatchException e)
            {
                System.out.print("Invalid Input, try again.");
                sc.nextLine();
            }
        }

        sc.nextLine();
        System.out.print("Enter Category Code: ");
        String ccode = sc.nextLine();

        double totalValue = quantity * price;
        System.out.println("=================================");
        System.out.println("Product Name: " + pname);
        System.out.println("Stock Quantity: "+ quantity);
        System.out.println("Unit Price: " + price);
        System.out.println("Total Value: "+ totalValue);
        System.out.println("Stock Status: "+ getStockStatus(quantity));
        System.out.println("Recommendation: " + getReorderAdvice(quantity));
        System.out.println("Category Code: " + ccode);
        System.out.println("Category Name: " + getCategoryName(ccode));
    }
}
