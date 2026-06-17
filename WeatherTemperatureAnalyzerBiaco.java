import java.util.InputMismatchException;
import java.util.Scanner;

public class WeatherTemperatureAnalyzerBiaco 
{
    public static String getWeatherCondition(double temp)
    {
        if (temp < 10)
        {
            return "Very Cold";
        }
        else if (temp >= 10 && temp <= 19)
        {
            return "Cold";
        }
        else if (temp > 19 && temp <= 27)
        {
            return "Cool / Pleasant";
        }
        else if (temp >= 28 && temp <= 34)
        {
            return "Warm";
        }
        else
        {
            return "Hot";
        }
    }

    public static String getComfortLevel(double temp)
    {
         if (temp < 10)
        {
            return "Uncomfortable - Dress Warmly";
        }
        else if (temp >= 10 && temp <= 19)
        {
            return "Slightly Uncomfortable - Bring a Jacket";
        }
        else if (temp > 19 && temp <= 27)
        {
            return "Comfortable - Light Clothing";
        }
        else if (temp >= 28 && temp <= 34)
        {
            return "Slightly Uncomfortable - Stay Hydrated";
        }
        else
        {
            return "Uncomfortable - Avoid Sun Exposure";
        }
    }

    public static String getSeasonName(String scode)
    {
        switch (scode)
        {
            case "DRY":
                return "Dry Season";
            case "WET":
                return "Wet Season";
            case "HOT":
                return "Summer/Hot Season";
            default:
                return "Invalid Season Code";
        }
    }

    public static void main(String[] args)
    {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter City Name: ");
        String cname = sc.nextLine();

        double temp = 0;
        while (true) 
        { 
            try 
            {
                System.out.print("Enter Temperature in Celsius: ");
                temp = sc.nextDouble();
                break;
            }
            catch (InputMismatchException e)
            {
                System.out.print("Invalid input, try again");
                sc.nextLine();
            }
        }

        sc.nextLine();
        System.out.print("Enter Season Code: ");
        String scode = sc.nextLine();

        System.out.println("=======================================");
        System.out.println("City Name: "+ cname);
        System.out.println("Temperature: "+ temp);
        System.out.println("Season Code: "+ scode);
        System.out.println("Weather Condition: "+ getWeatherCondition(temp));
        System.out.println("Comfort Level: "+ getComfortLevel(temp));
        System.out.println("Season Name: "+ getSeasonName(scode));

        sc.close();
    }
}
