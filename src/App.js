import React from 'react'
import ReactPDF, { PDFViewer } from '@react-pdf/renderer'
import './pdf.js'
import './App.css'

class App extends React.Component {
  render() {
    return (
      <div class="app">
        <PDFViewer>
          <MyDocument />
        </PDFViewer>
      </div>
    )
  }
}

export default App
