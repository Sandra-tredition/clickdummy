import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authenticator } from "otplib";

export const useAccountVerification = () => {
  // MFA verification for sensitive operations
  const [mfaVerificationDialog, setMfaVerificationDialog] = useState<{
    isOpen: boolean;
    operation: "email" | "password" | "bank" | null;
    onSuccess: () => void;
  }>({ isOpen: false, operation: null, onSuccess: () => {} });
  const [mfaVerificationCode, setMfaVerificationCode] = useState("");
  const [mfaVerificationError, setMfaVerificationError] = useState("");

  // Password verification for sensitive operations
  const [passwordVerificationDialog, setPasswordVerificationDialog] = useState<{
    isOpen: boolean;
    operation: "email" | "password" | "bank" | null;
    onSuccess: () => void;
  }>({ isOpen: false, operation: null, onSuccess: () => {} });
  const [passwordVerificationInput, setPasswordVerificationInput] =
    useState("");
  const [passwordVerificationError, setPasswordVerificationError] =
    useState("");

  const { verifyPassword } = useAuth();

  // Password verification for sensitive operations
  const requirePasswordVerification = (
    operation: "email" | "password" | "bank",
    onSuccess: () => void,
  ) => {
    setPasswordVerificationDialog({
      isOpen: true,
      operation,
      onSuccess,
    });
  };

  const verifyPasswordForOperation = async () => {
    if (!passwordVerificationInput) {
      setPasswordVerificationError("Bitte gib dein Passwort ein.");
      return;
    }

    try {
      const result = await verifyPassword(passwordVerificationInput);
      if (result.isValid) {
        passwordVerificationDialog.onSuccess();
        setPasswordVerificationDialog({
          isOpen: false,
          operation: null,
          onSuccess: () => {},
        });
        setPasswordVerificationInput("");
        setPasswordVerificationError("");
      } else {
        setPasswordVerificationError(
          "Ungültiges Passwort. Bitte versuche es erneut.",
        );
      }
    } catch (error) {
      setPasswordVerificationError("Fehler bei der Passwort-Verifikation.");
    }
  };

  const cancelPasswordVerification = () => {
    setPasswordVerificationDialog({
      isOpen: false,
      operation: null,
      onSuccess: () => {},
    });
    setPasswordVerificationInput("");
    setPasswordVerificationError("");
  };

  // MFA verification for sensitive operations
  const requireMfaVerification = (
    operation: "email" | "password" | "bank",
    onSuccess: () => void,
    mfaEnabled: boolean,
  ) => {
    if (!mfaEnabled) {
      requirePasswordVerification(operation, onSuccess);
      return;
    }

    setMfaVerificationDialog({
      isOpen: true,
      operation,
      onSuccess,
    });
  };

  const verifyMfaForOperation = (totpSecret: string) => {
    if (!mfaVerificationCode || mfaVerificationCode.length !== 6) {
      setMfaVerificationError("Bitte gib einen 6-stelligen Code ein.");
      return;
    }

    const mockValidCodes = ["123456", "654321", "111111", "000000"];
    const isValid =
      mockValidCodes.includes(mfaVerificationCode) ||
      authenticator.verify({
        token: mfaVerificationCode,
        secret: totpSecret,
        window: 2,
      });

    if (isValid) {
      mfaVerificationDialog.onSuccess();
      setMfaVerificationDialog({
        isOpen: false,
        operation: null,
        onSuccess: () => {},
      });
      setMfaVerificationCode("");
      setMfaVerificationError("");
    } else {
      setMfaVerificationError(
        "Ungültiger Code. Bitte versuche es erneut. (Tipp: Verwende 123456 für Demo)",
      );
    }
  };

  const cancelMfaVerification = () => {
    setMfaVerificationDialog({
      isOpen: false,
      operation: null,
      onSuccess: () => {},
    });
    setMfaVerificationCode("");
    setMfaVerificationError("");
  };

  return {
    // MFA verification
    mfaVerificationDialog,
    mfaVerificationCode,
    setMfaVerificationCode,
    mfaVerificationError,
    setMfaVerificationError,
    requireMfaVerification,
    verifyMfaForOperation,
    cancelMfaVerification,
    // Password verification
    passwordVerificationDialog,
    passwordVerificationInput,
    setPasswordVerificationInput,
    passwordVerificationError,
    setPasswordVerificationError,
    requirePasswordVerification,
    verifyPasswordForOperation,
    cancelPasswordVerification,
  };
};
