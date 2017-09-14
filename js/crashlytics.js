//
// https://github.com/mikelambert/react-native-fabric-crashlytics
//
import { Platform } from 'react-native'
import StackTrace from 'stacktrace-js'
import { Crashlytics } from 'react-native-fabric'

export function init () {
  if (__DEV__) {
    // Don't send exceptions from __DEV__, it's way too noisy!
    // Live reloading and hot reloading in particular lead to tons of noise...
    return
  }

  const originalHandler = global.ErrorUtils.getGlobalHandler()
  function errorHandler (e, isFatal) {
    StackTrace.fromError(e, { offline: true }).then(x => {
      Crashlytics.recordCustomExceptionName(
        e.message,
        e.message,
        x.map(row => ({
          functionName: row.functionName,
          lineNumber: row.lineNumber,
          columnNumber: row.columnNumber,
          source: row.source,
          args: row.args,
          fileName: `${row.fileName}:${row.lineNumber ||
            0}:${row.columnNumber || 0}`
        }))
      )
    })

    // And then re-throw the exception with the original handler
    if (originalHandler) {
      originalHandler(e, isFatal)
    }
  }
  global.ErrorUtils.setGlobalHandler(errorHandler)
}
