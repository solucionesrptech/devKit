import { cn } from "@/lib/utils";

type AppLogoProps = {
  alt?: string;
  className?: string;
  variant?: "full" | "mark";
};

function AppLogo({
  alt = "Devkit",
  className,
  variant = "full",
}: AppLogoProps) {
  return (
    <img
      src="/devkit.png"
      alt={alt}
      width={185}
      height={22}
      className={cn(
        "logo-devkit block h-5 w-auto shrink-0",
        variant === "mark" && "h-8 max-w-none object-left object-cover",
        className,
      )}
    />
  );
}

export { AppLogo };
