// import {createSlice} from "@reduxjs/toolkit"

// const initialState={
//     summary:[]
// }

// const SummarySlice=createSlice({
//     name:"summary",
//     initialState,
//     reducers:{
//         SummaryOfNews(state,action){
//             state.summary = action.payload
//         },
        
//     }
// })

// export default SummarySlice.reducer;
// export const {SummaryOfNews} =SummarySlice.actions;

import { createSlice } from '@reduxjs/toolkit'

const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedSummary = sessionStorage.getItem('newsSummary')
    return savedSummary ? { summary: JSON.parse(savedSummary) } : { summary: [] }
  }
  return { summary: [] }
}

const SummarySlice = createSlice({
  name: 'summary',
  initialState: loadInitialState(),
  reducers: {
    SummaryOfNews: (state, action) => {
      // Clear existing summary from sessionStorage if it exists
      if (typeof window !== 'undefined') {
        if (sessionStorage.getItem('newsSummary')) {
          sessionStorage.removeItem('newsSummary')
        }
              // Set new summary

        sessionStorage.setItem('newsSummary', JSON.stringify(action.payload))
      }
      state.summary = action.payload
    },
    clearSummary: (state) => {
      state.summary = []
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('newsSummary')
      }
    }
  }
})

export const { SummaryOfNews, clearSummary } = SummarySlice.actions
export default SummarySlice.reducer




// [
//   {
//     "headline": "Ukraine halts Russian gas transit to Europe",
//     "summary": "Ukraine halted Russian gas supplies to European customers via its pipeline network after a pre-war transit deal expired."
//   },
//   {
//     "headline": "Musk's new X avatar boosts memecoin value",
//     "summary": "Elon Musk's adoption of the moniker \"Kekius Maximus\" on X (formerly Twitter) saw the value of a memecoin with the same name skyrocketing."
//   },
//   {
//     "headline": "S. Korea to send plane's black box to US",
//     "summary": "South Korea will send a damaged flight data recorder from the Boeing 737-800 crash to the US for analysis."
//   },
//   {
//     "headline": "New Orleans car-ramming attack kills 10, FBI investigates potential terrorism link",
//     "summary": "A man rammed a pickup truck into a celebrating crowd in New Orleans, killing 10. The FBI is investigating it as an act of terrorism."
//   },
//   {
//     "headline": "Steve Bannon slams Musk, calls him a 'war profiteer'",
//     "summary": "Former Trump aide Steve Bannon criticized Elon Musk, calling him a 'war profiteer' and not a true American nationalist."
//   },
//   {
//     "headline": "Bangladesh to advance India ties while pursuing Hasina extradition",
//     "summary": "Bangladesh will continue to advance ties with India while simultaneously pursuing the extradition of ousted PM Sheikh Hasina."
//   },
//   {
//     "headline": "'Dungeons & Dragons' rule changes divide players",
//     "summary": "Significant rule changes in Dungeons & Dragons, including alterations to character customization and lore, sparked debate among players regarding inclusivity and tradition."
//   },
//   {
//     "headline": "Blake Lively and Justin Baldoni file lawsuits in harassment row",
//     "summary": "Blake Lively sued Justin Baldoni and others for harassment, while Baldoni and others sued the New York Times for libel."
//   },
//   {
//     "headline": "2024 India's hottest year in records kept since 1901",
//     "summary": "2024 was India's hottest year on record, with an anomaly of +0.65°C above the long-term average."
//   },
//   {
//     "headline": "Driver rams NY revelers in New Orleans, killing 10; FBI probes 'terror act'",
//     "summary": "A driver intentionally rammed his vehicle into a crowd of New Year's Eve revelers in New Orleans, killing 10. The FBI is investigating it as a potential terrorist act."
//   },
//   {
//     "headline": "Drunk driving cases rise across city, MMR on NYE",
//     "summary": "Drunk driving cases increased significantly in Mumbai and the surrounding MMR region on New Year's Eve."
//   },
//   {
//     "headline": "State orders 3rd party testing of govt hosp meds",
//     "summary": "The Maharashtra government ordered independent third-party testing of government hospital medicines following a hospital tragedy."
//   },
//   {
//     "headline": "Doctored CM video: Worli man detained",
//     "summary": "A Worli resident was detained for distributing a doctored video of the Chief Minister."
//   },
//   {
//     "headline": "Now, Ajit Pawar's mother calls for 'unity of family'",
//     "summary": "Ajit Pawar's mother appealed for family unity amidst political tensions."
//   },
//   {
//     "headline": "GST kitty rises 7% in Dec amid weak demand",
//     "summary": "GST collection increased by 7% in December despite weak demand in several sectors."
//   },
//   {
//     "headline": "'Need smart people': Trump aligns with Musk in H-IB row",
//     "summary": "President-elect Trump voiced support for skilled immigration, aligning with Elon Musk's stance on the H-1B visa program."
//   },
//   {
//     "headline": "20-yr RI for 8 Pak men held at sea with drugs 10 yrs ago",
//     "summary": "Eight Pakistani men were sentenced to 20 years of rigorous imprisonment for drug smuggling."
//   },
//   {
//     "headline": "78-year-old woman duped of ₹1.5 crore in cyber fraud",
//     "summary": "A 78-year-old woman lost ₹1.5 crore in a cyber fraud where perpetrators posed as police officers."
//   },
//   {
//     "headline": "Pak men smuggling in drugs an attack on Indian society: Court",
//     "summary": "A court called the drug smuggling case involving Pakistani nationals an attack on Indian society."
//   },
//   {
//     "headline": "Worli man detained for distributing doctored video on CM",
//     "summary": "A Worli man was detained for circulating a manipulated video of the Chief Minister."
//   },
//   {
//     "headline": "11.4 MT of waste collected on NYE",
//     "summary": "Mumbai civic staff collected 11.4 metric tonnes of waste during New Year's Eve celebrations."
//   },
//   {
//     "headline": "Rural, uneducated, and insured: The disproportionate rate of hysterectomies",
//     "summary": "A study reveals a disproportionately high rate of hysterectomies among rural, uneducated, insured Indian women."
//   },
//   {
//     "headline": "ACB: 713 corruption cases in Maha in '24, city records 39 cases",
//     "summary": "The Anti-Corruption Bureau registered 713 corruption cases in Maharashtra in 2024, with Mumbai recording 39 cases."
//   },
//   {
//     "headline": "Thane jail inmate hides phone in slipper, caught",
//     "summary": "A Thane jail inmate was caught with a mobile phone hidden inside a slipper."
//   }
// ]