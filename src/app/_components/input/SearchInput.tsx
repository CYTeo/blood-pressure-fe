// "use client"
// import { Input as AntInput, InputProps } from "antd";
// import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";

// export const SearchInput = (props: InputProps) => {
//   const { placeholder, size } = props;
//   return (
//     <AntInput
//       placeholder={placeholder}
//       allowClear={{
//         clearIcon: <CloseCircleOutlined className="input__icon" />,
//       }}
//       size={size ?? "middle"}
//       prefix={<SearchOutlined className="input__icon" />}
//       className={`input__search`}
//       {...props}
//     />
//   );
// };


"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input as AntInput, InputProps } from "antd";
import {
  CloseCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useDebounce } from "@/hooks/useDebounce";

export interface SearchInputProps extends InputProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const SearchInput = (props: SearchInputProps) => {
  const { placeholder, size, value, onChange, onLoadingChange, ...restProps } =
    props;

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [internalValue, setInternalValue] = useState(
    (value as string) ?? search,
  );
  const debouncedValue = useDebounce(internalValue, 300);
  const lastValueRef = useRef(value ?? search);

  // Sync internal state with external value or URL search param only when idle
  useEffect(() => {
    const newValue = (value as string) ?? search;
    if (newValue !== lastValueRef.current) {
      lastValueRef.current = newValue;
      // Only sync if the input is not currently "dirty" (being typed in)
      if (internalValue === debouncedValue) {
        setInternalValue(newValue);
      }
    }
  }, [value, search, debouncedValue, internalValue]);

  // Notify parent of loading state changes
  useEffect(() => {
    const isLoading = internalValue !== debouncedValue || isPending;
    onLoadingChange?.(isLoading);
  }, [internalValue, debouncedValue, isPending, onLoadingChange]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSearch = params.get("search") || "";

    if (debouncedValue === currentSearch) return;

    startTransition(() => {
      if (debouncedValue) {
        params.set("search", debouncedValue);
      } else {
        params.delete("search");
      }
      // onLoadingChange?.(true);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, pathname]);

  useEffect(() => {
    onLoadingChange?.(isPending);
  }, [isPending, onLoadingChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <AntInput
      placeholder={placeholder}
      allowClear={{
        clearIcon: <CloseCircleOutlined className="input__icon" />,
      }}
      size={size ?? "middle"}
      prefix={
        isPending ? (
          <LoadingOutlined spin className="input__icon" />
        ) : (
          <SearchOutlined className="input__icon" />
        )
      }
      value={internalValue}
      onChange={handleChange}
      className={`input__search`}
      {...restProps}
    />
  );
};

