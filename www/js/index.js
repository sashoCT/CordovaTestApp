/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("onPushNotification", this.onPushNotification, false); // optional, register to receive push notification payloads.
document.addEventListener("onDeepLink", this.onDeepLink, false); // optional, register to receive deep links.
document.addEventListener(
  "onCleverTapProfileSync",
  this.onCleverTapProfileSync,
  false
); // optional: to be notified of CleverTap user profile synchronization updates
document.addEventListener(
  "onCleverTapProfileDidInitialize",
  this.onCleverTapProfileDidInitialize,
  false
); // optional, to be notified when the CleverTap user profile is initialized

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  CleverTap.notifyDeviceReady();
  var props = { Name: "XYZ", Price: 123 };
  CleverTap.recordEventWithNameAndProps("Cordova Event", props);
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");

  //Register handlers
  FirebasePlugin.onMessageReceived(
    function (message) {
      try {
        console.log("onMessageReceived");
        console.dir(message);
        if (message.messageType === "notification") {
          handleNotificationMessage(message);
        } else {
          handleDataMessage(message);
        }
      } catch (e) {
        logError("Exception in onMessageReceived callback: " + e.message);
      }
    },
    function (error) {
      logError("Failed receiving FirebasePlugin message", error);
    }
  );
}

var handleNotificationMessage = function (message) {
  var title;
  if (message.title) {
    title = message.title;
  } else if (message.notification && message.notification.title) {
    title = message.notification.title;
  } else if (message.aps && message.aps.alert && message.aps.alert.title) {
    title = message.aps.alert.title;
  }

  var body;
  if (message.body) {
    body = message.body;
  } else if (message.notification && message.notification.body) {
    body = message.notification.body;
  } else if (message.aps && message.aps.alert && message.aps.alert.body) {
    body = message.aps.alert.body;
  }

  var msg = "Notification message received";
  if (message.tap) {
    msg += " (tapped in " + message.tap + ")";
  }
  if (title) {
    msg += "; title=" + title;
  }
  if (body) {
    msg += "; body=" + body;
  }
  msg += ": " + JSON.stringify(message);
  log(msg);
};

var handleDataMessage = function (message) {
  log("Data message received: " + JSON.stringify(message));
};
