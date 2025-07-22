import { customColors } from "@/shared-theme/themePrimitives";

const Users = () => {
  return (
    <svg
      width="22"
      height="23"
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11.5" r="11" fill={customColors.blue[500]} />
      <path
        d="M17.457 16.375C17.457 15.2139 16.344 14.2261 14.7904 13.86M13.457 16.375C13.457 14.9022 11.6662 13.7083 9.45703 13.7083C7.24789 13.7083 5.45703 14.9022 5.45703 16.375M13.457 11.7083C14.9298 11.7083 16.1237 10.5144 16.1237 9.04167C16.1237 7.56891 14.9298 6.375 13.457 6.375M9.45703 11.7083C7.98427 11.7083 6.79036 10.5144 6.79036 9.04167C6.79036 7.56891 7.98427 6.375 9.45703 6.375C10.9298 6.375 12.1237 7.56891 12.1237 9.04167C12.1237 10.5144 10.9298 11.7083 9.45703 11.7083Z"
        stroke="#F3FBFF"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Users;
