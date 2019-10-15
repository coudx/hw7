import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

const pdf = ({color1}) => {
  const rgb = [color1.substring(1,3), color1.substring(3,5), color1.substring(5,7)]
  const color2 = `rgb(${rgb.map(c => (parseInt(c, 16) * 0.8)).join()})`
  return (
    <div className="pdf" style={{background: `linear-gradient(${color1}, ${color2})`}} />
  )
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
)

module.exports = {pdf, MyDocument}
