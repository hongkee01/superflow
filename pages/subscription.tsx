import React, { useState } from "react"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import ApplicationLayout from "../components/ApplicationLayout"
import styles from "../styles/Subscription.module.css"
import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { abi } from "../utils/abi"
import { isMounted } from "../hooks/isMounted"

const Subscription: NextPage = () => {
	const mounted = isMounted()
	const [subscriptionName, setSubscriptionName] = useState("")
	const [monthlyPrice, setMonthlyPrice] = useState("")
	const [crypto, setCrypto] = useState("USDC")
	const [isStreamingPayment, setIsStreamingPayment] = useState(false)
	const [isRecurring, setIsRecurring] = useState(false)
	const { address, isConnected } = useAccount()
	const { config } = usePrepareContractWrite({
		address: "0x7432D6d775AbC6ECb0b99F3F9Bf589d5c6EB91AE",
		abi: abi,
		functionName: "createSubscription",
		args: [
			[10, 20],
			"hello",
			"0xcb3c44718789f3eA8E3E8195dBd0a8e88Dd53469",
			true,
			true,
			true,
			true,
			true,
		],
	})
	const { data, isLoading, isSuccess, write } = useContractWrite(config)

	function handleChange(event, setData) {
		setData(event.target.value)
	}

	// const connectWalletButton = () => {
	// 	return (
	// 	<ConnectButton accountStatus="address" chainStatus="name" showBalance={false} />
	// 	)
	//   }
	function connectWalletButton() {
		return (
			<ConnectButton
				accountStatus="address"
				chainStatus="name"
				showBalance={false}
			/>
		)
	}

	function deployContractButton() {
		return (
			<button
				className={styles.submit_btn}
				disabled={!write}
				onClick={() => write?.()}
			>
				Deploy subscription!
			</button>
		)
	}

	// TODO: handle inputs validation (e.g. check empty fields) when time permits

	return (
		<div>
			<Head>
				<title>Create Subscription | SuperFlow</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<ApplicationLayout isActive={[0, 1]}>
				<main className={styles.container}>
					<form>
						<label>
							Subscription Name:
							<input
								type="text"
								value={subscriptionName}
								onChange={() => handleChange(event, setSubscriptionName)}
								className={styles.subscription_name}
								required
							/>
						</label>

						<label>
							Monthly Price:
							<input
								type="number"
								value={monthlyPrice}
								onChange={() => handleChange(event, setMonthlyPrice)}
								className={styles.subscription_name}
								required
							/>
						</label>

						<label>
							Accepted Stablecoin:
							<select
								name="crypto"
								className={styles.crypto}
								onChange={() => handleChange(event, setCrypto)}
								required
							>
								<option value="usdc">USDC</option>
								<option value="dai">DAI</option>
								<option value="usdt">USDT</option>
							</select>
						</label>

						<label>
							Streaming as a form of payment:
							<input
								type="checkbox"
								name="streaming"
								value="true"
								onChange={() => handleChange(event, setIsStreamingPayment)}
								className={styles.streaming_payment}
							/>
						</label>

						<label>
							Recurring payment:
							<input
								type="checkbox"
								name="recurring"
								value="true"
								onChange={() => handleChange(event, setIsRecurring)}
								className={styles.recurring_payment}
							/>
						</label>
						<div>
							{mounted ? isConnected ? deployContractButton() : connectWalletButton() : null}
							{isLoading && <div>Check Wallet</div>}
      						{isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
						</div>

					</form>
				</main>
			</ApplicationLayout>
		</div>
	)
}

export default Subscription
