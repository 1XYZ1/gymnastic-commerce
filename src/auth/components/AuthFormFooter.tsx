export const AuthFormFooter = () => {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      Haciendo click, estás de acuerdo con{' '}
      <a href="/terms">términos y condiciones</a> y{' '}
      <a href="/privacy">políticas de uso</a>.
    </div>
  );
};
