import React from "react";

export interface IRoute {
  path: string;
  exact: boolean;
  menuName?: string;
  component: React.FC;
}
