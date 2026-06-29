import type { ReactNode, SVGProps } from "react";

// Line icon set. Single consistent stroke, drawn on a 24px grid. Kept inline so
// the app carries no icon dependency and every glyph shares one visual weight.

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

type IconProps = SVGProps<SVGSVGElement>;

export function IconDashboard(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    </Icon>
  );
}

export function IconCar(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12.5 5.6 8a2.2 2.2 0 0 1 2.05-1.4h8.7A2.2 2.2 0 0 1 18.4 8L20 12.5" />
      <path d="M3.5 12.5h17v3.2a.8.8 0 0 1-.8.8h-1.4" />
      <path d="M5.7 16.5H4.3a.8.8 0 0 1-.8-.8v-3.2" />
      <path d="M9 16.5h6" />
      <circle cx="7" cy="16.5" r="1.6" />
      <circle cx="17" cy="16.5" r="1.6" />
    </Icon>
  );
}

export function IconGroups(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19v-1A4 4 0 0 1 7.5 14h3a4 4 0 0 1 4 4v1" />
      <path d="M16 5.4a3 3 0 0 1 0 5.8" />
      <path d="M17 14.2a4 4 0 0 1 3.5 3.8V19" />
    </Icon>
  );
}

export function IconPublications(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z" />
      <path d="M14 3.5V7a1 1 0 0 0 1 1h3" />
      <path d="M9 12.5h6" />
      <path d="M9 16h4" />
    </Icon>
  );
}

export function IconSend(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 3.5 10 14" />
      <path d="M20.5 3.5 14 20.5l-3.5-7.5L3 9.5z" />
    </Icon>
  );
}

export function IconHistory(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M5.5 3.5v3.5h3.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Icon>
  );
}

export function IconStats(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 4v15.5H20" />
      <path d="M8 16.5V12" />
      <path d="M12.5 16.5V8" />
      <path d="M17 16.5v-3" />
    </Icon>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 9.5h16" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
    </Icon>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h9" />
      <path d="M18 7h2" />
      <circle cx="15" cy="7" r="2.2" />
      <path d="M4 17h2" />
      <path d="M11 17h9" />
      <circle cx="8" cy="17" r="2.2" />
    </Icon>
  );
}

export function IconUser(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1.2A4.8 4.8 0 0 1 9.8 14h4.4a4.8 4.8 0 0 1 4.8 4.8V20" />
    </Icon>
  );
}

export function IconRoles(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 19 6v5c0 4.3-2.9 7.5-7 8.5-4.1-1-7-4.2-7-8.5V6z" />
      <path d="M9.3 11.8 11.2 13.7 15 10" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.8-3.8" />
    </Icon>
  );
}

export function IconBell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 9a6 6 0 1 0-12 0c0 4.5-1.8 6-1.8 6h15.6S18 13.5 18 9z" />
      <path d="M10.2 19a2 2 0 0 0 3.6 0" />
    </Icon>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9.5 12 15l6-5.5" />
    </Icon>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H14" />
      <path d="M10 12h10" />
      <path d="M16.5 8.5 20 12l-3.5 3.5" />
    </Icon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6.5h16" />
      <path d="M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" />
      <path d="M6.6 6.5 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.8-12.5" />
      <path d="M10 10.5v5" />
      <path d="M14 10.5v5" />
    </Icon>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 15.5V4.5" />
      <path d="M8 8.5 12 4.5l4 4" />
      <path d="M5 14.5v3A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5v-3" />
    </Icon>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Icon>
  );
}
