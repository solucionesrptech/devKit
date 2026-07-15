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
      src="/devkit-mark.png"
      alt={alt}
      width={96}
      height={96}
      className={cn(
        "logo-devkit block shrink-0 rounded-lg object-contain",
        variant === "mark" ? "h-10 w-10" : "h-12 w-12",
        className,
      )}
    />
  );
}

export { AppLogo };
