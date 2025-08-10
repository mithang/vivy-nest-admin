import PropTypes from 'prop-types'
import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Colors from '../constants/Colors'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  paginationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    marginVertical: height * 0.0125,
    justifyContent: 'center',
    // top: 0,
    bottom: 10,
    // left: width * 0.25,
    right: width * 0.05,
  },
  pagination: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginHorizontal: width * 0.015,
    backgroundColor: Colors.orange,
    color: Colors.orange,
  },
})

const Pagination = ({ size, paginationIndex, scrollToIndex, paginationDefaultColor, paginationActiveColor }: any) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: size }).map((_, index) => (
        <TouchableOpacity
          style={[
            styles.pagination,
            paginationIndex === index
              ? { backgroundColor: paginationActiveColor }
              : { backgroundColor: paginationDefaultColor },
          ]}
          key={index}
          onPress={() => scrollToIndex({ index })}
        />
      ))}
    </View>
  )
}

Pagination.propTypes = {
  scrollToIndex: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  paginationIndex: PropTypes.number,
  paginationActiveColor: PropTypes.string,
  paginationDefaultColor: PropTypes.string,
}

Pagination.defaultProps = {
  data: [],
  paginationIndex: 0,
  paginationActiveColor: Colors.orange,
  paginationDefaultColor: 'white',
}

export default Pagination
