import { StyleSheet } from 'react-native'

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputField: {
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    padding: 10,
    color: '#808080',
    // backgroundColor: '#fff',
  },
  hero: {
    fontFamily: 'bold',
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  headerText: {
    fontFamily: 'medium',
    fontSize: 32,
    textTransform: 'capitalize',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ptag: {
    fontSize: 16,
    fontFamily: 'regular',
  },
  btn: {
    // backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    // fontFamily: 'mon-b',
  },
  btnIcon: {
    position: 'absolute',
    left: 16,
    // fontSize: 18,
  },
  footer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderTopColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
})
