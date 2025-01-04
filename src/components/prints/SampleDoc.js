import React from 'react'
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

// const styles = StyleSheet.
// StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#E4E4E4',
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// })

export const SampleDoc = ({ data }) => {
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>Section 1</Text>
        </View>
        <View>
          <Text break>Section 2</Text> {/* Page break here */}
        </View>
      </Page>
    </Document>
  )
}
