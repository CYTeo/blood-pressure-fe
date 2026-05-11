import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  collapsed: boolean;
  openKeys: string[];
}

const initialState: LayoutState = {
  collapsed: false,
  openKeys: [], // 👈 NEW
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
    setOpenKeys: (state, action: PayloadAction<string[]>) => {
      state.openKeys = action.payload;
    }, // 👈 NEW
  },
});

export const { toggleCollapsed, setCollapsed, setOpenKeys } =
  layoutSlice.actions;
export default layoutSlice.reducer;
