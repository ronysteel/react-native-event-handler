import StackTrace from 'stacktrace-js'
import { Crashlytics } from 'react-native-fabric'

export const log = (message: string, err: Error) => {
  if (__DEV__) {
    console.error(message, err)
    return
  }

  StackTrace.fromError(err, { offline: true })
    .then(x => {
      Crashlytics.recordCustomExceptionName(
        message,
        e.message,
        x.map(row => ({
          functionName: row.functionName,
          lineNumber: row.lineNumber,
          columnNumber: row.columnNumber,
          source: row.source,
          args: row.args,
          fileName: `${row.fileName}:${row.lineNumber || 0}:${row.columnNumber || 0}`,
        }))
      )
    })
}
