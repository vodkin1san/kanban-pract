import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  type SxProps,
  type Theme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "@localization/config";

const inputLabelStyles: SxProps<Theme> = {
  color: "#FFFFFF",
};

const selectStyles: SxProps<Theme> = {
  color: "#FFFFFF",
  "& .MuiSelect-icon": { color: "#FFFFFF" },
};

export interface LanguageSwitcherProps {
  sx?: SxProps<Theme>;
}

const LanguageSwitcher = ({ sx }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 120, ...sx }}>
      <InputLabel id="language-select-label" sx={inputLabelStyles}>
        {t("language")}
      </InputLabel>{" "}
      <Select
        labelId="language-select-label"
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        label={t("language")}
        sx={selectStyles}
      >
        {supportedLanguages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {t(lang.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { LanguageSwitcher };
