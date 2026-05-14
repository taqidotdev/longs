function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      className="bg-secondary size-12 flex justify-center items-center rounded-lg hover:cursor-pointer hover:text-primary hover:rounded-xl duration-150"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default IconButton;
