export const getPermissions = (role) => {
  switch (role) {
    case "Admin":
      return {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true
      };

    case "HR":
      return {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: false
      };

    case "User":
      return {
        canView: true,
        canCreate: false,
        canEdit: false,
        canDelete: false
      };

    default:
      return {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false
      };
  }
};