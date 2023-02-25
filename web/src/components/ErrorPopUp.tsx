interface ErrorPopUpProps {
  message: string;
}

export const ErrorPopUp: React.FC<ErrorPopUpProps> = (msg) => {
  return (
    <div
      className="p-4 mb-4 text-sm text-amber-800 rounded-lg bg-amber-50 "
      role="alert"
    >
      <span className="font-medium">Info alert!</span> Change a few things up
      and try submitting again.
    </div>
  );
};

export default ErrorPopUp;
