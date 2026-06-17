mport java.util.InputMismatchException;
import java.util.Scanner;

public class VehicleRegistrationAnalyzer 
{
    public static String getAgeStatus(int vage)
    {
        if (vage > 0 && vage <= 2)
        {
            return "Brand New";
        }
        else if (vage > 2 && vage <= 5)
        {
            return "Relatively New";
        }
        else if (vage > 5 && vage <= 10)
        {
            return "Mid-Aged";
        }
        else if (vage > 10 && vage <= 20)
        {
            return "Old";
        }
        else
        {
            return "Vintage / Very Old";
        }
    }

    public static  String getRoadworthiness(double mileage)
    {
        if (mileage < 20000)
        {
            return "Excellent Condition";
        }
        else if (mileage > 20000 && mileage <= 60000)
        {
            return "Good Condition";
        }
        else if (mileage > 60000 && mileage <= 100000)
        {
            return "Fair - Schedule Maintenance";
        }
        else if (mileage > 100000 && mileage <= 150000)
        {
            return "Poor - Needs Major Service";
        }
        else
        {
            return "Critical - Overhaul Recommended";
        }
    }

    public static String getVehicleType(String vcode)
    {
        switch (vcode)
        {
            case "CAR":
                return "Private Car";
            case "TRUCK":
                return "Cargo Truck";
            case "BUS":
                return "Passenger Bus";
            case "MCYCLE":
                return "MCYCLE";
            default:
                return "Invalid Vehicle Type";
        }
    }
    public static void main (String[] args)
    {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Owner Name:");
        String oname = sc.nextLine();

        int vage = 0;
        double mileage = 0;
        while (true)
        {
            try 
            {
                System.out.print("Enter Vehicle Age in years: ");
                vage = sc.nextInt();
            } 
            catch (InputMismatchException e) 
            {
                System.out.print("Invalid input, try again");
                sc.nextLine();
            }

            try
            {
                System.out.print("Enter Mileage in km: ");
                mileage = sc.nextDouble();
                break;
            }
            catch (InputMismatchException e)
            {
                System.out.print("Invalid input, try again.");
                sc.nextLine();
            }
        }
        sc.nextLine();
        System.out.print("Enter Vehicle Type Code: ");
        String vcode = sc.nextLine();

        System.out.println("================================");
        System.out.println("Owner Name: "+ oname);
        System.out.println("Vehicle Age:"+ vage);
        System.out.println("Mileage: "+ mileage);
        System.out.println("Estimated Annual Fee: "+ (1500 + (10 * vage)) + "P");
        System.out.println("Age Status: " + getAgeStatus(vage));
        System.out.println("Recommendation: "+ getRoadworthiness(mileage));
        System.out.println("Vehicle Type: "+ getVehicleType(vcode));

        sc.close();
    }
}
