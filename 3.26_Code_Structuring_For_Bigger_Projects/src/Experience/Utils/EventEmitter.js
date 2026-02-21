/**
 * Simple namespaced EventEmitter implementation.
 *
 * Supports:
 * - Multiple events registration at once
 * - Namespaces (event.namespace)
 * - Removing specific events or entire namespaces
 * - Passing arguments to listeners
 *
 * Example event names:
 *  "resize"
 *  "resize.ui"
 *  "load, ready"
 *  "update.app"
 */
export default class EventEmitter {
  /**
   * Creates a new EventEmitter instance.
   *
   * Internal structure:
   * {
   *   namespace: {
   *     eventName: [callback, callback]
   *   }
   * }
   */
  constructor() {
    this.callbacks = {};
    this.callbacks.base = {};
  }

  /**
   * Register one or multiple event listeners.
   *
   * @param {string} _names - Event name(s). Can be space/comma separated.
   *                          Supports namespaces (example: "resize.ui").
   * @param {Function} callback - Function to execute when event is triggered.
   * @returns {EventEmitter|boolean} Returns this for chaining, false if invalid.
   *
   * @example
   * emitter.on('resize', () => console.log('resized'));
   * emitter.on('resize.ui', () => console.log('UI resized'));
   * emitter.on('ready, load', () => console.log('App ready'));
   */
  on(_names, callback) {
    if (!_names || typeof callback === "undefined") {
      console.warn("EventEmitter.on: wrong arguments");
      return false;
    }

    const names = this.resolveNames(_names);

    names.forEach((_name) => {
      const name = this.resolveName(_name);

      if (!this.callbacks[name.namespace]) {
        this.callbacks[name.namespace] = {};
      }

      if (!this.callbacks[name.namespace][name.value]) {
        this.callbacks[name.namespace][name.value] = [];
      }

      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  /**
   * Remove event listeners.
   *
   * @param {string} _names - Event name(s) or namespace.
   *                          Examples:
   *                          "resize"
   *                          "resize.ui"
   *                          ".ui" (removes entire namespace)
   * @returns {EventEmitter|boolean}
   *
   * @example
   * emitter.off('resize');
   * emitter.off('resize.ui');
   */
  off(_names) {
    if (!_names) {
      console.warn("EventEmitter.off: wrong arguments");
      return false;
    }

    const names = this.resolveNames(_names);

    names.forEach((_name) => {
      const name = this.resolveName(_name);

      // Remove entire namespace
      if (name.namespace !== "base" && name.value === "") {
        delete this.callbacks[name.namespace];
      } else {
        // Remove event from all namespaces
        if (name.namespace === "base") {
          for (const namespace in this.callbacks) {
            if (this.callbacks[namespace][name.value]) {
              delete this.callbacks[namespace][name.value];

              if (Object.keys(this.callbacks[namespace]).length === 0) {
                delete this.callbacks[namespace];
              }
            }
          }
        }

        // Remove event from specific namespace
        else if (
          this.callbacks[name.namespace] &&
          this.callbacks[name.namespace][name.value]
        ) {
          delete this.callbacks[name.namespace][name.value];

          if (Object.keys(this.callbacks[name.namespace]).length === 0) {
            delete this.callbacks[name.namespace];
          }
        }
      }
    });

    return this;
  }

  /**
   * Trigger an event.
   *
   * @param {string} _name - Event name (can include namespace).
   * @param {Array} [_args=[]] - Arguments passed to callbacks.
   * @returns {*} Returns the first callback result (if any).
   *
   * @example
   * emitter.trigger('resize');
   * emitter.trigger('update', [deltaTime]);
   */
  trigger(_name, _args = []) {
    if (!_name) {
      console.warn("EventEmitter.trigger: wrong arguments");
      return false;
    }

    let finalResult;
    let result;

    const args = Array.isArray(_args) ? _args : [];
    let name = this.resolveName(this.resolveNames(_name)[0]);

    // Trigger event across all namespaces
    if (name.namespace === "base") {
      for (const namespace in this.callbacks) {
        const callbacks = this.callbacks[namespace][name.value];

        if (Array.isArray(callbacks)) {
          callbacks.forEach((callback) => {
            result = callback.apply(this, args);
            if (typeof finalResult === "undefined") {
              finalResult = result;
            }
          });
        }
      }
    }

    // Trigger specific namespace
    else {
      const callbacks = this.callbacks[name.namespace]?.[name.value];

      if (Array.isArray(callbacks)) {
        callbacks.forEach((callback) => {
          result = callback.apply(this, args);
          if (typeof finalResult === "undefined") {
            finalResult = result;
          }
        });
      }
    }

    return finalResult;
  }

  /**
   * Resolve multiple event names.
   *
   * Cleans string and splits by space.
   *
   * @param {string} _names
   * @returns {string[]} Array of event names
   */
  resolveNames(_names) {
    let names = _names;
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, "");
    names = names.replace(/[,/]+/g, " ");
    names = names.split(" ");

    return names.filter(Boolean);
  }

  /**
   * Resolve a single event name into:
   * {
   *   original: "resize.ui",
   *   value: "resize",
   *   namespace: "ui"
   * }
   *
   * @param {string} name
   * @returns {{ original: string, value: string, namespace: string }}
   */
  resolveName(name) {
    const parts = name.split(".");

    return {
      original: name,
      value: parts[0] || "",
      namespace: parts.length > 1 && parts[1] !== "" ? parts[1] : "base",
    };
  }
}
