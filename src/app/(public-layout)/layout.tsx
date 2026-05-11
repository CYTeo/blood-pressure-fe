
export type LayoutPropsType = {
  children: React.ReactNode;
};

const AppLayout = async (props: LayoutPropsType) => {
  const { children } = props;
  // getPermission() here if any
  // const permission = await getPermission();

  return (
    // <PermissionProvider initialPermissions={permissions}>
      <div>{children}</div>
    // </PermissionProvider>
  );
};

export default AppLayout;
