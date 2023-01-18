import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import Router from "next/router"
import type { FC } from "react"
import { useState } from "react"

import { SignInWithGoogle } from "@/components/buttons/animated/SignInWithGoogle"
import { StartFormButton } from "@/components/buttons/StartFormButton"
import { FormDescription } from "@/components/texts/static/FormDescription"
import { useRegister } from "@/contexts/RegisterContext"

export const LandingSection: FC<{ byPass: boolean | undefined }> = ({
  byPass
}) => {
  const { section } = useRegister()

  const [showLogIn, setShowLogin] = useState(false)

  return (
    <>
      <div className="mt-8 mb-10">
        <FormDescription />
      </div>
      <AnimateSharedLayout>
        <AnimatePresence>
          <motion.div
            key={`${showLogIn ? "logable" : "continue"}`}
            initial={{ y: 10, opacity: 0 }}
            exit={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            layout={"position"}
            className="flex justify-center"
          >
            {showLogIn && (
              <SignInWithGoogle
                successAction={() => {
                  Router.push(
                    { pathname: "/register", query: { filling: "true" } },
                    undefined,
                    { shallow: true }
                  )
                  section.set("student")
                }}
              />
            )}
            {!showLogIn && (
              <StartFormButton byPass={byPass} setShowLogin={setShowLogin} />
            )}
          </motion.div>
        </AnimatePresence>
      </AnimateSharedLayout>
    </>
  )
}
