// pages/api/data.js
export default function handler(req, res) {
    const data = {
      table2: [    { "stage": 17, "100m_n": 12, "100m_x_sd": "10.46 ± 0.09", "100m_anova": 0.05, "400m_n": 7, "400m_x_sd": "46.29 ± 1.06", "400m_anova": null },
        { "stage": 18, "100m_n": 20, "100m_x_sd": "10.34 ± 0.16", "100m_anova": null, "400m_n": 13, "400m_x_sd": "45.76 ± 1.38", "400m_anova": null },
        { "stage": 19, "100m_n": 34, "100m_x_sd": "10.26 ± 0.16", "100m_anova": null, "400m_n": 20, "400m_x_sd": "45.37 ± 0.95", "400m_anova": null },
        { "stage": 20, "100m_n": 37, "100m_x_sd": "10.21 ± 0.22", "100m_anova": 0.01, "400m_n": 22, "400m_x_sd": "45.09 ± 0.83", "400m_anova": null },
        { "stage": 21, "100m_n": 41, "100m_x_sd": "10.09 ± 0.17", "100m_anova": 0.01, "400m_n": 27, "400m_x_sd": "44.76 ± 0.78", "400m_anova": null },
        { "stage": 22, "100m_n": 42, "100m_x_sd": "9.97 ± 0.21", "100m_anova": null, "400m_n": 31, "400m_x_sd": "44.63 ± 0.74", "400m_anova": null },
        { "stage": 23, "100m_n": 39, "100m_x_sd": "9.98 ± 0.15", "100m_anova": null, "400m_n": 34, "400m_x_sd": "44.76 ± 0.93", "400m_anova": null },
        { "stage": 24, "100m_n": 40, "100m_x_sd": "10.01 ± 0.18", "100m_anova": null, "400m_n": 31, "400m_x_sd": "44.59 ± 0.64", "400m_anova": 0.05 },
        { "stage": 25, "100m_n": 38, "100m_x_sd": "10.01 ± 0.14", "100m_anova": null, "400m_n": 26, "400m_x_sd": "44.96 ± 0.61", "400m_anova": null },
        { "stage": 26, "100m_n": 35, "100m_x_sd": "9.98 ± 0.15", "100m_anova": null, "400m_n": 27, "400m_x_sd": "45.02 ± 1.02", "400m_anova": null }],  // Paste Table 2 JSON data here
      table3: [    { "stage": 1, "100m_n": 50, "100m_x_sd": "10.37 ± 0.21", "100m_anova": 0.01, "400m_n": 50, "400m_x_sd": "45.81 ± 1.29", "400m_anova": 0.01 },
        { "stage": 2, "100m_n": 45, "100m_x_sd": "10.26 ± 0.21", "100m_anova": 0.01, "400m_n": 38, "400m_x_sd": "45.15 ± 0.92", "400m_anova": 0.01 },
        { "stage": 3, "100m_n": 42, "100m_x_sd": "10.11 ± 0.15", "100m_anova": null, "400m_n": 39, "400m_x_sd": "44.80 ± 0.57", "400m_anova": null },
        { "stage": 4, "100m_n": 47, "100m_x_sd": "10.06 ± 0.14", "100m_anova": 0.05, "400m_n": 36, "400m_x_sd": "44.70 ± 0.64", "400m_anova": null },
        { "stage": 5, "100m_n": 42, "100m_x_sd": "9.99 ± 0.13", "100m_anova": null, "400m_n": 37, "400m_x_sd": "44.70 ± 0.81", "400m_anova": null },
        { "stage": 6, "100m_n": 47, "100m_x_sd": "9.97 ± 0.12", "100m_anova": null, "400m_n": 31, "400m_x_sd": "44.70 ± 0.72", "400m_anova": null },
        { "stage": 7, "100m_n": 43, "100m_x_sd": "9.95 ± 0.24", "100m_anova": null, "400m_n": 26, "400m_x_sd": "44.76 ± 0.74", "400m_anova": null }],  // Paste Table 3 JSON data here
      table4: [    { "stage": -4, "100m_n": 40, "100m_x_sd": "10.14 ± 0.19", "100m_anova": null, "400m_n": 21, "400m_x_sd": "45.40 ± 1.06", "400m_anova": null },
        { "stage": -3, "100m_n": 41, "100m_x_sd": "10.09 ± 0.19", "100m_anova": null, "400m_n": 29, "400m_x_sd": "45.27 ± 0.89", "400m_anova": null },
        { "stage": -2, "100m_n": 46, "100m_x_sd": "10.02 ± 0.12", "100m_anova": null, "400m_n": 31, "400m_x_sd": "45.08 ± 0.83", "400m_anova": 0.05 },
        { "stage": -1, "100m_n": 45, "100m_x_sd": "9.95 ± 0.20", "100m_anova": 0.01, "400m_n": 38, "400m_x_sd": "44.68 ± 0.61", "400m_anova": 0.01 },
        { "stage": "PB", "100m_n": 50, "100m_x_sd": "9.86 ± 0.07", "100m_anova": 0.01, "400m_n": 50, "400m_x_sd": "44.06 ± 0.32", "400m_anova": 0.01 },
        { "stage": 1, "100m_n": 37, "100m_x_sd": "9.98 ± 0.11", "100m_anova": null, "400m_n": 37, "400m_x_sd": "44.87 ± 0.83", "400m_anova": null },
        { "stage": 2, "100m_n": 34, "100m_x_sd": "9.99 ± 0.12", "100m_anova": null, "400m_n": 21, "400m_x_sd": "44.85 ± 0.66", "400m_anova": 0.05 },
        { "stage": 3, "100m_n": 34, "100m_x_sd": "10.06 ± 0.20", "100m_anova": null, "400m_n": 17, "400m_x_sd": "45.34 ± 0.73", "400m_anova": null },
        { "stage": 4, "100m_n": 24, "100m_x_sd": "10.05 ± 0.13", "100m_anova": null, "400m_n": 12, "400m_x_sd": "45.27 ± 0.78", "400m_anova": null }],  // Paste Table 4 JSON data here
      table5: [    { "stage": 1, "100m_n": 40, "100m_x_sd": "10.36 ± 0.18", "100m_anova": 0.05, "400m_n": 30, "400m_x_sd": "45.90 ± 1.12", "400m_anova": 0.01 },
        { "stage": 2, "100m_n": 35, "100m_x_sd": "10.24 ± 0.17", "100m_anova": null, "400m_n": 29, "400m_x_sd": "45.30 ± 1.05", "400m_anova": null },
        { "stage": 3, "100m_n": 39, "100m_x_sd": "10.16 ± 0.14", "100m_anova": null, "400m_n": 25, "400m_x_sd": "45.05 ± 0.85", "400m_anova": 0.05 },
        { "stage": 4, "100m_n": 41, "100m_x_sd": "10.08 ± 0.16", "100m_anova": null, "400m_n": 28, "400m_x_sd": "44.98 ± 0.90", "400m_anova": null },
        { "stage": 5, "100m_n": 45, "100m_x_sd": "10.03 ± 0.13", "100m_anova": 0.01, "400m_n": 32, "400m_x_sd": "44.76 ± 0.76", "400m_anova": 0.01 },
        { "stage": 6, "100m_n": 48, "100m_x_sd": "9.98 ± 0.12", "100m_anova": null, "400m_n": 34, "400m_x_sd": "44.65 ± 0.69", "400m_anova": null },
        { "stage": 7, "100m_n": 43, "100m_x_sd": "9.97 ± 0.15", "100m_anova": null, "400m_n": 30, "400m_x_sd": "44.71 ± 0.72", "400m_anova": null }],  // Paste Table 5 JSON data here
    };
    res.status(200).json(data);
  }
  