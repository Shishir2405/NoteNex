import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Database,
  Mail,
  Key,
  Users,
  FileText,
  Upload,
  Download,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  Copy,
  Edit3,
  Plus,
  X,
} from "lucide-react";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "NoteNex",
    platformDescription: "Share and discover academic notes",
    maintenanceMode: false,
    registrationEnabled: true,
    guestAccess: true,
    maxFileSize: 10,
    allowedFileTypes: ["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png"],
    featuredContent: true,
    publicStats: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    passwordMinLength: 6,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorEnabled: false,
    ipWhitelist: "",
    securityHeaders: true,
    rateLimiting: true,
    contentScanning: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    adminAlerts: true,
    systemNotifications: true,
    userReports: true,
    contentApproval: true,
    systemMaintenance: false,
    dailyReports: true,
    weeklyDigest: true,
    emergencyAlerts: true,
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    apiEnabled: true,
    apiRateLimit: 1000,
    apiKeyRequired: true,
    webhooksEnabled: false,
    corsEnabled: true,
    allowedOrigins: "https://localhost:3000, https://notenex.com",
    apiVersion: "v1",
    documentationPublic: true,
  });

  // Storage Settings
  const [storageSettings, setStorageSettings] = useState({
    cloudinaryEnabled: true,
    maxStorageSize: 100, // GB
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 30,
    compressionEnabled: true,
    cdnEnabled: true,
    storageLocation: "auto",
  });

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API & Integrations", icon: Globe },
    { id: "storage", label: "Storage & Backup", icon: Database },
    { id: "advanced", label: "Advanced", icon: Key },
  ];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSaveSettings = async (settingsType, settings) => {
    setLoading(true);
    try {
      // Here you would make API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      showMessage("success", `${settingsType} settings saved successfully`);
    } catch (error) {
      showMessage("error", `Failed to save ${settingsType} settings`);
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Platform Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              value={generalSettings.platformName}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  platformName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={generalSettings.maxFileSize}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  maxFileSize: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Description
          </label>
          <textarea
            value={generalSettings.platformDescription}
            onChange={(e) =>
              setGeneralSettings((prev) => ({
                ...prev,
                platformDescription: e.target.value,
              }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-gray-900">Platform Features</h4>
          {Object.entries({
            maintenanceMode: "Maintenance Mode",
            registrationEnabled: "User Registration",
            guestAccess: "Guest Access",
            featuredContent: "Featured Content",
            publicStats: "Public Statistics",
          }).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">
                  {key === "maintenanceMode" &&
                    "Put the platform in maintenance mode"}
                  {key === "registrationEnabled" &&
                    "Allow new user registrations"}
                  {key === "guestAccess" && "Allow guests to browse content"}
                  {key === "featuredContent" && "Show featured content section"}
                  {key === "publicStats" &&
                    "Display platform statistics publicly"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalSettings[key]}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSaveSettings("General", generalSettings)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Authentication & Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Min Length
            </label>
            <input
              type="number"
              value={securitySettings.passwordMinLength}
              onChange={(e) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  passwordMinLength: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  maxLoginAttempts: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP Whitelist (comma separated)
          </label>
          <textarea
            value={securitySettings.ipWhitelist}
            onChange={(e) =>
              setSecuritySettings((prev) => ({
                ...prev,
                ipWhitelist: e.target.value,
              }))
            }
            placeholder="192.168.1.1, 10.0.0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={2}
          />
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-gray-900">Security Features</h4>
          {Object.entries({
            requireEmailVerification: "Email Verification Required",
            twoFactorEnabled: "Two-Factor Authentication",
            securityHeaders: "Security Headers",
            rateLimiting: "Rate Limiting",
            contentScanning: "Content Scanning",
          }).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">
                  {key === "requireEmailVerification" &&
                    "Require users to verify their email"}
                  {key === "twoFactorEnabled" &&
                    "Enable 2FA for enhanced security"}
                  {key === "securityHeaders" &&
                    "Add security headers to responses"}
                  {key === "rateLimiting" && "Limit API requests per user"}
                  {key === "contentScanning" &&
                    "Scan uploaded content for threats"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings[key]}
                  onChange={(e) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSaveSettings("Security", securitySettings)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Admin Notifications</h4>
          {Object.entries({
            emailNotifications: "Email Notifications",
            adminAlerts: "Admin Alerts",
            systemNotifications: "System Notifications",
            userReports: "User Reports",
            contentApproval: "Content Approval Requests",
            systemMaintenance: "System Maintenance Alerts",
            dailyReports: "Daily Reports",
            weeklyDigest: "Weekly Digest",
            emergencyAlerts: "Emergency Alerts",
          }).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">
                  {key === "emailNotifications" &&
                    "Receive notifications via email"}
                  {key === "adminAlerts" && "Important admin-only alerts"}
                  {key === "systemNotifications" &&
                    "System status notifications"}
                  {key === "userReports" && "When users report content"}
                  {key === "contentApproval" && "When content needs approval"}
                  {key === "systemMaintenance" &&
                    "Planned maintenance notifications"}
                  {key === "dailyReports" && "Daily platform statistics"}
                  {key === "weeklyDigest" && "Weekly summary reports"}
                  {key === "emergencyAlerts" && "Critical system alerts"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[key]}
                  onChange={(e) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() =>
              handleSaveSettings("Notification", notificationSettings)
            }
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          API Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Rate Limit (requests/hour)
            </label>
            <input
              type="number"
              value={apiSettings.apiRateLimit}
              onChange={(e) =>
                setApiSettings((prev) => ({
                  ...prev,
                  apiRateLimit: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Version
            </label>
            <select
              value={apiSettings.apiVersion}
              onChange={(e) =>
                setApiSettings((prev) => ({
                  ...prev,
                  apiVersion: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="v1">v1</option>
              <option value="v2">v2</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allowed Origins (CORS)
          </label>
          <textarea
            value={apiSettings.allowedOrigins}
            onChange={(e) =>
              setApiSettings((prev) => ({
                ...prev,
                allowedOrigins: e.target.value,
              }))
            }
            placeholder="https://example.com, https://app.example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">API Features</h4>
          {Object.entries({
            apiEnabled: "API Access Enabled",
            apiKeyRequired: "API Key Required",
            webhooksEnabled: "Webhooks Enabled",
            corsEnabled: "CORS Enabled",
            documentationPublic: "Public API Documentation",
          }).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">
                  {key === "apiEnabled" &&
                    "Enable API access for third-party apps"}
                  {key === "apiKeyRequired" && "Require API keys for access"}
                  {key === "webhooksEnabled" && "Enable webhook notifications"}
                  {key === "corsEnabled" &&
                    "Enable Cross-Origin Resource Sharing"}
                  {key === "documentationPublic" &&
                    "Make API documentation publicly accessible"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={apiSettings[key]}
                  onChange={(e) =>
                    setApiSettings((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSaveSettings("API", apiSettings)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderStorageSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Storage & Backup Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Storage Size (GB)
            </label>
            <input
              type="number"
              value={storageSettings.maxStorageSize}
              onChange={(e) =>
                setStorageSettings((prev) => ({
                  ...prev,
                  maxStorageSize: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={storageSettings.backupFrequency}
              onChange={(e) =>
                setStorageSettings((prev) => ({
                  ...prev,
                  backupFrequency: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Period (days)
            </label>
            <input
              type="number"
              value={storageSettings.retentionPeriod}
              onChange={(e) =>
                setStorageSettings((prev) => ({
                  ...prev,
                  retentionPeriod: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Location
            </label>
            <select
              value={storageSettings.storageLocation}
              onChange={(e) =>
                setStorageSettings((prev) => ({
                  ...prev,
                  storageLocation: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="auto">Auto</option>
              <option value="us-east">US East</option>
              <option value="us-west">US West</option>
              <option value="eu-central">EU Central</option>
              <option value="asia-pacific">Asia Pacific</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Storage Features</h4>
          {Object.entries({
            cloudinaryEnabled: "Cloudinary Integration",
            autoBackup: "Automatic Backups",
            compressionEnabled: "File Compression",
            cdnEnabled: "CDN Acceleration",
          }).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">
                  {key === "cloudinaryEnabled" &&
                    "Use Cloudinary for file storage and processing"}
                  {key === "autoBackup" &&
                    "Automatically backup data and files"}
                  {key === "compressionEnabled" &&
                    "Compress files to save storage space"}
                  {key === "cdnEnabled" && "Use CDN for faster file delivery"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={storageSettings[key]}
                  onChange={(e) =>
                    setStorageSettings((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Download Backup
          </button>
          <button
            onClick={() => handleSaveSettings("Storage", storageSettings)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Advanced Configuration
        </h3>

        <div className="space-y-6">
          {/* Environment Variables */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Environment Variables
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Configure environment-specific settings. Changes require
                application restart.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DATABASE_URL
                  </label>
                  <input
                    type="password"
                    value="mongodb://***********"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CLOUDINARY_API_KEY
                  </label>
                  <input
                    type="password"
                    value="***********"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">System Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-medium text-yellow-900 mb-2">
                  Clear Cache
                </h5>
                <p className="text-sm text-yellow-700 mb-3">
                  Clear all system caches to improve performance
                </p>
                <button className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </button>
              </div>

              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">
                  Rebuild Search Index
                </h5>
                <p className="text-sm text-blue-700 mb-3">
                  Rebuild search index for better search results
                </p>
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Database className="h-4 w-4 mr-2" />
                  Rebuild Index
                </button>
              </div>

              <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">
                  Generate Sitemap
                </h5>
                <p className="text-sm text-green-700 mb-3">
                  Generate new sitemap for search engines
                </p>
                <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Globe className="h-4 w-4 mr-2" />
                  Generate Sitemap
                </button>
              </div>

              <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
                <h5 className="font-medium text-purple-900 mb-2">
                  Export Data
                </h5>
                <p className="text-sm text-purple-700 mb-3">
                  Export platform data for backup or migration
                </p>
                <button className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h4 className="font-medium text-red-900 mb-3">Danger Zone</h4>
            <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-red-900">
                      Reset Platform Statistics
                    </h5>
                    <p className="text-sm text-red-700">
                      Reset all platform statistics and counters
                    </p>
                  </div>
                  <button className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                    Reset Stats
                  </button>
                </div>

                <hr className="border-red-200" />

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-red-900">
                      Clear All User Sessions
                    </h5>
                    <p className="text-sm text-red-700">
                      Force logout all users (except admins)
                    </p>
                  </div>
                  <button className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                    Clear Sessions
                  </button>
                </div>

                <hr className="border-red-200" />

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-red-900">Factory Reset</h5>
                    <p className="text-sm text-red-700">
                      Reset all settings to default values
                    </p>
                  </div>
                  <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Factory Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              System Information
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Platform Version:
                  </span>
                  <span className="ml-2 text-gray-600">v2.1.0</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Node.js Version:
                  </span>
                  <span className="ml-2 text-gray-600">v18.17.0</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Database Version:
                  </span>
                  <span className="ml-2 text-gray-600">MongoDB 6.0</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Last Update:
                  </span>
                  <span className="ml-2 text-gray-600">2024-03-15</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Environment:
                  </span>
                  <span className="ml-2 text-gray-600">Production</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Uptime:</span>
                  <span className="ml-2 text-gray-600">15 days, 6 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600">
            Configure platform settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last saved: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600 bg-red-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "general" && renderGeneralSettings()}
        {activeTab === "security" && renderSecuritySettings()}
        {activeTab === "notifications" && renderNotificationSettings()}
        {activeTab === "api" && renderAPISettings()}
        {activeTab === "storage" && renderStorageSettings()}
        {activeTab === "advanced" && renderAdvancedSettings()}
      </div>

      {/* Footer */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Info className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">
              Changes to settings may require application restart to take
              effect.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Reset to Defaults
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
