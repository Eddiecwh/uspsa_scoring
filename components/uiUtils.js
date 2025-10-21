// UI utility functions and toast notifications

export const UI = {
  showToast(message, type = "info", duration = 4000) {
    const container = document.getElementById("toastContainer");
    const toastId = `toast-${Date.now()}`;
    const bgClass = this.getBootstrapBgClass(type);
    const icon = this.getToastIcon(type);
    const title = this.getToastTitle(type);

    const toastHtml = `
      <div class="toast align-items-center text-bg-${bgClass} border-0" role="alert" id="${toastId}" data-bs-autohide="true" data-bs-delay="${duration}">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${icon} ${title}:</strong> ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", toastHtml);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  },

  showConfirmToast(message, onConfirm, onCancel = null) {
    const container = document.getElementById("toastContainer");
    const toastId = `toast-${Date.now()}`;

    const toastHtml = `
      <div class="toast align-items-center text-bg-warning border-0" role="alert" id="${toastId}" data-bs-autohide="false">
        <div class="toast-body">
          <div class="mb-2">
            <strong>❓ Confirm:</strong> ${message}
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-success" onclick="handleConfirm('${toastId}', true)">Yes</button>
            <button class="btn btn-sm btn-secondary" onclick="handleConfirm('${toastId}', false)">No</button>
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", toastHtml);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    window[`confirmCallback_${toastId}`] = onConfirm;
    window[`cancelCallback_${toastId}`] = onCancel;

    toastElement.addEventListener("hidden.bs.toast", () => {
      delete window[`confirmCallback_${toastId}`];
      delete window[`cancelCallback_${toastId}`];
      toastElement.remove();
    });
  },

  getBootstrapBgClass(type) {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "danger";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  },

  getToastIcon(type) {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  },

  getToastTitle(type) {
    switch (type) {
      case "success":
        return "Success";
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      default:
        return "Info";
    }
  },

  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
  },
};

// Global function for confirm toast callbacks
window.handleConfirm = function (toastId, confirmed) {
  const confirmCallback = window[`confirmCallback_${toastId}`];
  const cancelCallback = window[`cancelCallback_${toastId}`];

  if (confirmed && confirmCallback) {
    confirmCallback();
  } else if (!confirmed && cancelCallback) {
    cancelCallback();
  }

  const toastElement = document.getElementById(toastId);
  const toast = bootstrap.Toast.getInstance(toastElement);
  toast.hide();
};
